using Microsoft.Data.Sqlite;
using NativeHost.Enums;
using NativeHost.Messages;

namespace NativeHost.Logging
{
    public abstract class LogBase
    {
        protected string CommandText;

        protected abstract SqliteCommand GetInsertCommand(Message message, int activityId);

        public void Insert(SqliteConnection connection, Message message, out bool successful, out string errorMessage)
        {
            var activityId = InsertUserActivity(connection, message.userId, message.userEmail, message.timestamp, message.ActionTaken, message.Operation);
            var command = GetInsertCommand(message, activityId);
            command.Connection = connection;
            
            try
            {
                command.ExecuteNonQuery();
                successful = true;
                errorMessage = string.Empty;
            }
            catch (SqliteException e)
            {
                successful = false;
                errorMessage = e.Message;
            }

        }

        private static int InsertUserActivity(SqliteConnection connection, string userId, string userEmail, string timestamp, ActionTaken actionTaken, Operation operation)
        {
            int insertedId = -1;
            var command = connection.CreateCommand();
            command.CommandText =
                @"
                INSERT INTO user_activity (UserId, UserEmail, TimeStamp, ActionTaken, Operation)
                VALUES ($userId, $userEmail, $timeStamp, $actionTaken, $operation);
                SELECT last_insert_rowid();
                ";
            command.Parameters.AddWithValue("$userId", userId);
            command.Parameters.AddWithValue("userEmail", userEmail);
            command.Parameters.AddWithValue("$timeStamp", timestamp);
            command.Parameters.AddWithValue("$actionTaken", actionTaken.ToString());
            command.Parameters.AddWithValue("$operation", operation.ToString());

            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    insertedId = reader.GetInt32(0);
                }
            }
            return insertedId;
        }
    }
}
