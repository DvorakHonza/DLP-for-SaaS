using Microsoft.Data.Sqlite;
using NativeHost.Messages;

namespace NativeHost.Logging
{
    public class ScreenCaptureLog : LogBase
    {
        protected new string CommandText =
            @"
            INSERT INTO operation_screen_capture (Url, Activity)
            VALUES ($url, $activity);
            ";

        protected override SqliteCommand GetInsertCommand(Message message, int activityId)
        {
            var command = new SqliteCommand(CommandText);
            command.Parameters.AddWithValue("$url", message.Url);
            command.Parameters.AddWithValue("$activity", activityId);

            return command;
        }
    }
}
