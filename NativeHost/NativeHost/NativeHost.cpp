#include <iostream>
#include <fcntl.h>
#include <io.h>
#include <tuple>
#include <string_view>
#include <optional>
#include <nlohmann/json.hpp>


unsigned int getMessageLength() {
	unsigned int length = 0;
	for (int i = 0; i < 4; i++) {
		unsigned int read_char = getchar();
		if (read_char == EOF)
			return EOF;

		length = length | (read_char << i * 8);
	}

	return length;
}

void sendMessage(std::string_view message) {
	const auto length = message.length();
	std::cout << char(length >> 0)
			  << char(length >> 8)
			  << char(length >> 16)
			  << char(length >> 24);

	std::cout << message << std::flush;
}

std::string readMessage() {
	unsigned int length = getMessageLength();

	std::string received = "";
	for (unsigned int i = 0; i < 4; i++)
	{
		received += getchar();
	}

	return received;
}

void processMessage(std::string_view message) {
	nlohmann::json json = nlohmann::json::parse(message);

}



int main()
{
	std::ignore = _setmode(_fileno(stdin), _O_BINARY);

	while (1) {
		
		const auto received = readMessage();
		sendMessage("{\"text\":\"Hello, Extension!\"}");
	}

	return 0;
}
