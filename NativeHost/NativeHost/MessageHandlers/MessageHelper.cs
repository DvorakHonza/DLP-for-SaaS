using System;
using System.IO;
using System.Text.Json;
using NativeHost.Messages;

namespace NativeHost.MessageHandlers
{
    public static class MessageHelper
    {
        public static Message ReadMessage()
        {
            byte[] messageBytes;

            using (var reader = new BinaryReader(Console.OpenStandardInput()))
            {
                var length = reader.ReadInt32();
                messageBytes = reader.ReadBytes(length);
            }

            return JsonSerializer.Deserialize<Message>(System.Text.Encoding.UTF8.GetString(messageBytes));
        }

        public static void WriteMessage(Message message)
        {
            var messageJson = JsonSerializer.Serialize(message);
            var messageBytes = System.Text.Encoding.UTF8.GetBytes(messageJson);

            using (var writer = new BinaryWriter(Console.OpenStandardOutput()))
            {
                writer.Write(messageBytes.Length);
                writer.Write(messageBytes);
            }
        }
    }
}
