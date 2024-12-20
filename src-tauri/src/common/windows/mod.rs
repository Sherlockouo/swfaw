use log::info;
use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder};

pub struct WindowManager;

use tauri::{Position, Window};

fn move_window_to_other_monitor(window: &Window, i: usize) -> tauri::Result<()> {
    let monitors = window.available_monitors()?;
    let monitor = monitors.get(i).ok_or(tauri::Error::WindowNotFound)?;

    let pos = monitor.position();

    window.set_position(Position::Physical(tauri::PhysicalPosition {
        x: pos.x,
        y: 0,
    }))?;

    window.center()?;
    Ok(())
}

impl WindowManager {
    pub fn create_window(
        app: &AppHandle,
        label: &str,
        title: &str,
        width: f64,
        height: f64,
    ) {
        // 创建 WebviewWindowBuilder
        let builder = WebviewWindowBuilder::new(app, label, WebviewUrl::App("index.html".into()))
            .title(title)
            .inner_size(width, height);

        info!("create window with title: {}", title);
        // 创建窗口
        builder.build().unwrap();
    }
}
