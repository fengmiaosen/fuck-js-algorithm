
The key participants in the MCP architecture are:
* MCP Host: The AI application that coordinates and manages one or multiple MCP clients
* MCP Client: A component that maintains a connection to an MCP server and obtains context from an MCP server for the MCP host to use
* MCP Server: A program that provides context to MCP clients


For example: Visual Studio Code acts as an MCP host. When Visual Studio Code establishes a connection to an MCP server, such as the Sentry MCP server, the Visual Studio Code runtime instantiates an MCP client object that maintains the connection to the Sentry MCP server. When Visual Studio Code subsequently connects to another MCP server, such as the local filesystem server, the Visual Studio Code runtime instantiates an additional MCP client object to maintain this connection, hence maintaining a one-to-one relationship of MCP clients to MCP servers.

## MCP consists of two layers

### Data layer

Defines the JSON-RPC based protocol for client-server communication, including lifecycle management, and core primitives, such as tools, resources, prompts and notifications


### Transport Layer

The **transport layer** in MCP is responsible for the communication between the MCP host, clients, and servers. It defines how messages and data are exchanged, ensuring reliable, secure, and efficient transfer of context information.

Key concepts of the MCP transport layer:

- **Protocol Agnostic**: The transport layer is designed to be independent of any specific network protocol. MCP can operate over various transports such as WebSockets, HTTP/2, gRPC, or even local IPC, as long as the transport supports the required message semantics.
- **Message Framing**: The transport layer handles the framing of messages, ensuring that context requests, responses, and notifications are correctly packaged and delivered.
- **Connection Management**: It manages the lifecycle of connections between MCP clients and servers, including establishing, maintaining, and closing connections as needed.
- **Reliability and Ordering**: The transport layer may provide guarantees about message delivery and ordering, depending on the underlying protocol.
- **Security**: It is responsible for securing the communication channel, typically via TLS or other encryption mechanisms, to protect context data in transit.
- **Multiplexing**: Supports multiple logical streams or channels over a single physical connection, allowing concurrent context operations without interference.

**Example:**  
When an MCP client connects to an MCP server, the transport layer establishes a secure WebSocket connection. All context requests and responses are serialized (e.g., as JSON or Protobuf) and sent as discrete messages over this connection. The transport layer ensures that messages are delivered in order and retransmits them if necessary.

**Summary:**  
The transport layer abstracts the details of network communication, allowing the MCP data layer to focus on the structure and semantics of context data, while the transport layer ensures that this data is exchanged efficiently and securely between participants.
