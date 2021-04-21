# web3-provider

This library creates a web3 provider that delegates sending all signing methods to the given provider (if it is available) and all other methods to the provided endpoint

## Installation

```shell
npm install ky # a peer dependency
npm install simple-web3-provider
```

## Getting Started

```javascript
import Web3 from 'web3';
import { Provider } from 'simple-web3-provider';

const web3 = new Web3(new Provider(url, options));
```

## License

MIT License, see the included [LICENSE](LICENSE) file.
