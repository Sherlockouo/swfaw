use chrono::{DateTime, Utc};
use serde::ser::{SerializeMap, Serializer};
use serde_json::Serializer as JsonSerializer;
use std::fmt;
use tracing_core::{Event, Subscriber};
use tracing_subscriber::fmt::{
    format::{self, FormatEvent, FormatFields},
    FmtContext, FormattedFields,
};
use tracing_subscriber::registry::LookupSpan;

pub struct JsonFormatter;

impl<S, N> FormatEvent<S, N> for JsonFormatter
where
    S: Subscriber + for<'a> LookupSpan<'a>,
    N: for<'a> FormatFields<'a> + 'static,
{
    fn format_event(
        &self,
        ctx: &FmtContext<'_, S, N>,
        mut writer: format::Writer<'_>,
        event: &Event<'_>,
    ) -> fmt::Result {
        // 获取当前时间并格式化为 RFC 3339
        let now: DateTime<Utc> = Utc::now();
        let formatted_time = now.to_rfc3339();

        // 获取事件的元数据
        let metadata = event.metadata();

        // 使用 Vec<u8> 作为缓冲区构建 JSON 输出
        let mut buffer = Vec::new();

        let mut serializer = JsonSerializer::new(&mut buffer);

        // 创建一个可序列化的 map
        let mut map_serializer = match serializer.serialize_map(None) {
            Ok(map) => map,
            Err(_) => return Err(fmt::Error),
        };

        // 序列化时间戳和级别
        let _ = map_serializer.serialize_entry("timestamp", &formatted_time);
        let _ = map_serializer.serialize_entry("level", &metadata.level().to_string());

        // 提取 trace_id
        // 后续可以扩展提取其他字段
        let mut trace_id = None;
        if let Some(scope) = ctx.event_scope() {
            for span in scope.from_root() {
                let extensions = span.extensions();
                if let Some(fields) = extensions.get::<FormattedFields<N>>() {
                    // 直接使用字段访问
                    let field_value = fields.to_string();
                    if field_value.contains("trace_id") {
                        trace_id = field_value
                            .split('=')
                            .last()
                            .map(|s| s.trim_matches(|c| c == '"' || c == ' ').to_string());
                    }
                }
            }
        }

        if let Some(tid) = trace_id {
            let _ = map_serializer.serialize_entry("trace_id", &tid);
        }

        // // 序列化事件字段
        let mut visitor = tracing_serde::SerdeMapVisitor::new(map_serializer);
        event.record(&mut visitor);

        // 处理 take_serializer 的 Result
        let mut map_serializer = match visitor.take_serializer() {
            Ok(serializer) => serializer,
            Err(_) => return Err(fmt::Error),
        };
        // file name
        if let Some(filename) = metadata.file() {
            let _ = map_serializer.serialize_entry("filename", filename);
        }

        // line number
        if let Some(line_number) = metadata.line() {
            let _ = map_serializer.serialize_entry("line_number", &line_number);
        }

        // 结束序列化
        let _ = map_serializer.end();

        // 将序列化后的 JSON 写入原始 writer
        let json_output = String::from_utf8(buffer).expect("Invalid UTF-8");
        writeln!(writer, "{}", json_output)?;

        Ok(())
    }
}
