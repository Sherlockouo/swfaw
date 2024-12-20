mod command;
mod schema;
mod common {
    pub mod tray;
    pub mod utils;
    pub mod windows;
}

use command::{create_or_show_window, create_symlink};
use common::tray::create_tray;
use common::utils::jsonformatter::JsonFormatter;
use schema::Payload;
use tauri::{Emitter, RunEvent};
use tauri_plugin_autostart::MacosLauncher;
use tracing::info;
use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let json_layer = fmt::layer().with_ansi(false).event_format(JsonFormatter);

    // 启用 tracing
    tracing_subscriber::registry()
        // .with(
        //     tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
        //         format!(
        //             "{}=info,tower_http=info,axum=info",
        //             env!("CARGO_CRATE_NAME")
        //         )
        //         .into()
        //     }),
        // )
        .with(json_layer)
        .init();

    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            info!("{}, {argv:?}, {cwd}", app.package_info().name);
            app.emit("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        // .plugin(
        //     tauri_plugin_log::Builder::default()
        //         .level(log::LevelFilter::Info)
        //         .build(),
        // )
        .plugin(tauri_plugin_screen_lock_status::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["com.sherlockouo.app"]),
        ))
        .plugin(tauri_plugin_fs::init())
        // .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_store::Builder::default().build()) // store
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(move |app| {
            #[cfg(desktop)]
            {
                create_tray(app.handle())?;
            }
            // 监听屏幕是否亮起
            let _ = tauri_plugin_screen_lock_status::WINDOW_TAURI.set(app.handle().clone());

            Ok(())
        });

    #[cfg(target_os = "macos")]
    {
        builder = builder.menu(tauri::menu::Menu::default);
    }

    #[allow(unused_mut)]
    let mut app = builder
        .invoke_handler(tauri::generate_handler![
            create_or_show_window,
            create_symlink
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    #[cfg(target_os = "macos")]
    app.set_activation_policy(tauri::ActivationPolicy::Regular);

    app.run(move |_app_handle, _event| {
        #[cfg(desktop)]
        if let RunEvent::ExitRequested { code, api, .. } = &_event {
            if code.is_none() {
                // Keep the event loop running even if all windows are closed
                // This allow us to catch system tray events when there is no window
                api.prevent_exit();
            }
        }
    });
}
