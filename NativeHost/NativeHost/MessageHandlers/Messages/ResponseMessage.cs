namespace NativeHost.MessageHandlers.Messages
{
    public class ResponseMessage
    {
        public bool Successful { get; set; }

#nullable enable
        public string? ErrorMessage { get; set; }
#nullable disable

        public ResponseMessage(bool succesful, string errorMessage = null)
        {
            Successful = succesful;
            ErrorMessage = errorMessage;
        }
    }
}
