use crate::common::windows;

use tauri::Manager;
use windows::WindowManager;

#[tauri::command]
pub async fn create_or_show_window(
    app: tauri::AppHandle,
    label: String,
    title: String,
    width: f64,
    height: f64,
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

#[tauri::command]
pub async fn create_symlink(source: String, target: String) -> Result<(), String> {
    std::os::unix::fs::symlink(source.clone(), target.clone()).map_err(|err| {
        format!(
            "Failed to create symlink from {} to {}: {}",
            source, target, err
        )
    })
}
