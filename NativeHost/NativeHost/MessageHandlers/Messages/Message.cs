using NativeHost.Enums;

namespace NativeHost.Messages
{
    public class Message
    {
        public string userEmail { get; set; }
        public string userId { get; set; }
        public string timestamp { get; set; }
        public int Type { get; set; }
        public Operation Operation { get; set; }
        public ActionTaken ActionTaken { get; set; }
#nullable enable
        public string? Url { get; set; }
        public string? Data { get; set; }
        public string? Filename { get; set; }
#nullable disable
    }
}
