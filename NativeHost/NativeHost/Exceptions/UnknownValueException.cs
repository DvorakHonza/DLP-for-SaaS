using System;

namespace NativeHost.Exceptions
{
    public class UnknownValueException : Exception
    {
        public override string Message { get; } = "Encountered unknown enum value.";
    }
}
