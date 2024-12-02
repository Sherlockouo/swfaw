use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder};

pub struct WindowManager;

impl WindowManager {
    pub fn create_window(app: &AppHandle, label: &str, title: &str, width: f64, height: f64) {
        WebviewWindowBuilder::new(app, label, WebviewUrl::App("index.html".into()))
            .title(title)
            .inner_size(width, height)
            .build()
            .unwrap();
    }
}
