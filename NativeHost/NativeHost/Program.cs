using NativeHost.MessageHandlers;

namespace NativeHost
{
    class Program
    {
        public static void Main()
        {
            var message = MessageHelper.ReadMessage();
            MessageHelper.WriteMessage(message);
        }
    }
}
