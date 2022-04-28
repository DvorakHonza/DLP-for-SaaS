using System.IO;
using NativeHost.MessageHandlers;
using NativeHost.Messages;

namespace NativeHost
{
    class Program
    {
        public static void Main()
        {
            while (true)
            {
                try
                {
                    Message message = MessageHelper.ReadMessage();
                    MessageHelper.ProcessMessage(message);
                }
                catch (EndOfStreamException)
                {
                    break;
                }
            }
        }
    }
}
