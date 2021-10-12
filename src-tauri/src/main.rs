#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use futures_util::StreamExt;
use tauri_plugin_websocket::TauriWebsocket;
use tokio::net::{TcpListener, TcpStream};

async fn start_server() {
  let addr = "127.0.0.1:9001".to_string();

  // Create the event loop and TCP listener we'll accept connections on.
  let try_socket = TcpListener::bind(&addr).await;
  let listener = try_socket.expect("Failed to bind");

  while let Ok((stream, _)) = listener.accept().await {
    tokio::spawn(accept_connection(stream));
  }
}

async fn accept_connection(stream: TcpStream) {
  let ws_stream = tokio_tungstenite::accept_async(stream)
    .await
    .expect("Error during the websocket handshake occurred");

  let (write, read) = ws_stream.split();
  read
    .forward(write)
    .await
    .expect("Failed to forward message")
}

fn main() {
  tauri::async_runtime::spawn(start_server());
  tauri::Builder::default()
    .plugin(TauriWebsocket::default())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
