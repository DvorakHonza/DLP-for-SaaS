using Microsoft.Data.Sqlite;
using NativeHost.Messages;

namespace NativeHost.Logging
{
    public class UploadLog : LogBase
    {
        protected new string CommandText =
            @"
            INSERT INTO operation_upload (Filename, Url, Activity)
            VALUES ($filename, $url, $activity);
            ";

        protected override SqliteCommand GetInsertCommand(Message message, int activityId)
        {
            var command = new SqliteCommand(CommandText);
            command.Parameters.AddWithValue("$filename", message.Filename);
            command.Parameters.AddWithValue("$url", message.Url);
            command.Parameters.AddWithValue("$activity", activityId);

            return command;
        }
    }
}
