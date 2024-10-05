# Node.js GIF Encoder (GIF89a)

This **Node.js GIF Encoder** is a specialized tool for creating GIF images programmatically, designed to strictly follow the GIF89a specification. Built with performance and precision in mind, this encoder manipulates data using strongly-typed arrays and buffers, ensuring efficient and accurate handling of pixel data. The project is ideal for developers who need precise control over the GIF creation process without any legacy format support like GIF87a.

## Key Features

- **Strict GIF89a Compliance:** Adheres closely to the GIF89a specification, without backward compatibility for GIF87a.
- **Efficient Data Handling:** All internal operations utilize `Uint8Array`, `Uint16Array`, and `Buffer` to ensure high performance and memory safety.
- **Powerful LZW Compression:** (In progress) A well-implemented LZW compression algorithm for optimized GIF size and speed.
- **Customizable Output:** Configure frame delays, loop count, and image quality to meet the specific needs of your project.
- **Full Test Coverage:** The project is fully covered by tests located in the `test` folder.

## Future Plans

- **Advanced LZW Compression:** We're working on perfecting the compression algorithm for better performance and smaller file sizes.
- **Additional Optimizations:** Further performance tuning to reduce memory usage and improve encoding speed.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).

## Contributing

Contributions are welcome! Please feel free to fork the project, submit issues, or open pull requests.
