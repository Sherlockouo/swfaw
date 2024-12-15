#[cfg(desktop)]
mod tray;
mod windows;

use tauri::{Manager, RunEvent};
use tauri_plugin_autostart::MacosLauncher;
use windows::WindowManager;

#[tauri::command]
async fn create_symlink(source: String, target: String) -> Result<(), String> {
    std::os::unix::fs::symlink(source.clone(), target.clone()).map_err(|err| {
        format!(
            "Failed to create symlink from {} to {}: {}",
            source, target, err
        )
    })
}

#[tauri::command]
async fn create_or_show_window(
    app: tauri::AppHandle,
    label: String,
    title: String,
    width: f64,
    height: f64,
    show: bool,
) {
    // 检查窗口是否已经存在
    if let Some(_window) = app.get_webview_window(&label) {
        // 如果窗口存在并且 `show` 参数为 true，则显示窗口
        // window.show().unwrap_or_else(|err| {
        //     eprintln!("Failed to show window {}: {}", label, err);
        // });
        //
    } else {
        // 如果窗口不存在，则创建新窗口
        WindowManager::create_window(&app, &label, &title, width, height);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["com.sherlockouo.app"]),
        ))
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
                tray::create_tray(app.handle())?;
            }

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
