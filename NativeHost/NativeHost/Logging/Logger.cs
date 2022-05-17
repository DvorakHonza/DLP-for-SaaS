using System.IO;
using System.Text.Json;
using Microsoft.Data.Sqlite;
using NativeHost.Enums;
using NativeHost.Exceptions;
using NativeHost.Messages;

namespace NativeHost.Logging
{
    public class LoggerBase
    {
        private readonly string DbFileName = "DlpForSaas.db";
        private static readonly string SettingsFilePath = @"../settings.json";
        private string DbPath { get; }

        public LoggerBase()
        {
            DbPath = GetDbPath();
        }

        public void CreateLog(Message message, out bool successful, out string errorMessage)
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

        private static string GetDbPath()
        {
            using var reader = new StreamReader(new FileStream(SettingsFilePath, FileMode.Open));
            var content = reader.ReadToEnd();
            var data = JsonSerializer.Deserialize<DatabaseInfo>(content);
            return data.DatabaseLocation;
        }

        private class DatabaseInfo
        {
            public string DatabaseLocation { get; set; }
        }
    }

    public static class Logger
    {
        private static LoggerBase _instance;
        public static LoggerBase Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new LoggerBase();
                }
                return _instance;
            }
            set
            {
                _instance = value;
            }
        }
    }
}
