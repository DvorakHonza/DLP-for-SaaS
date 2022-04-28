using System;
using System.IO;
using System.Text;
using System.Text.Json;
using NativeHost.Logging;
using NativeHost.MessageHandlers.Messages;
using NativeHost.Messages;

namespace NativeHost.MessageHandlers
{
    public static class MessageHelper
    {
        public static Message ReadMessage()
        {
            byte[] messageBytes;
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            using (var reader = new BinaryReader(Console.OpenStandardInput(), Encoding.UTF8))
            {

                var length = reader.ReadInt32();
                messageBytes = reader.ReadBytes(length);
            }

            return JsonSerializer.Deserialize<Message>(Encoding.UTF8.GetString(messageBytes), options);

        }

        public static void WriteMessage(ResponseMessage message)
        {
            var messageJson = JsonSerializer.Serialize(message);
            var messageBytes = Encoding.UTF8.GetBytes(messageJson);

            using var writer = new BinaryWriter(Console.OpenStandardOutput());
            writer.Write(messageBytes.Length);
            writer.Write(messageBytes);
        }

        public static void ProcessMessage(Message message)
        {
            bool result = false;
            string errorMessage = string.Empty;
            try
            {
                Logger.Instance.CreateLog(message, out result, out errorMessage);
            }
            catch(Exception e)
            {
                result = false;
                errorMessage = e.Message;
            }
            finally
            {
                WriteMessage(new ResponseMessage(result, errorMessage));
            }
        }
    }
}
