using System.IO;
using Microsoft.Data.Sqlite;
using NativeHost.Enums;
using NativeHost.Exceptions;
using NativeHost.Messages;

namespace NativeHost.Logging
{
    public class Logger
    {
        private static readonly string DbFileName = "DlpForSaas.db";
        private static readonly string DbPath = @"C:\Program Files\DLP for SaaS";

        public static void CreateLog(Message message, out bool successful, out string errorMessage)
        {
            using var conn = new SqliteConnection($@"Data Source={Path.Combine(DbPath, DbFileName)}");
            conn.Open();

            LogBase log = message.Operation switch
            {
                Operation.Upload => new UploadLog(),
                Operation.ClipboardCopy => new ClipboardLog(),
                Operation.ScreenCapture => new ScreenCaptureLog(),
                _ => throw new UnknownValueException(),
            };

            try
            {
                log.Insert(conn, message, out successful, out errorMessage);
            }
            catch (SqliteException e)
            {
                successful = false;
                errorMessage = e.Message;
            }
        }
    }
}
