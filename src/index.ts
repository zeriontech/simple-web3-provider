/* global globalThis */
import './globalThisPolyfill.js';
import ky from 'ky';
import type { RetryOptions } from 'ky';

const IGNORED_METHODS: Set<string> = new Set([
  'eth_accounts',
  'eth_sendTransaction',
  'eth_sign',
  'eth_signTypedData_v3',
  'eth_signTypedData',
  'personal_sign',
]);

interface Payload {
  method: string;
  params: any[];
}

function handleMaybeJSONError(error: ky.HTTPError) {
  try {
    return error.response.json().then(result => {
      throw result;
    });
  } catch {
    throw error;
  }
}

interface AsyncCallback {
  (error: null | Error, result?: any): void;
}

interface SendMethod {
  (payload: Payload, callback: AsyncCallback): void;
}

interface Options {
  maxRetries?: number;
}

function createKyRetryOptions({ maxRetries }: Options): RetryOptions {
  return { limit: maxRetries, methods: ['post'] };
}

export class Provider {
  url: string;
  retryOptions: RetryOptions;

  constructor(url: string, { maxRetries = 10 }: Options = {}) {
    this.url = url;
    this.retryOptions = createKyRetryOptions({ maxRetries });
  }

  sendAsync(payload: Payload, callback: AsyncCallback) {
    if (!IGNORED_METHODS.has(payload.method)) {
      this.sendDefaultRequest(payload, callback);
    } else if (
      typeof globalThis !== undefined &&
      (globalThis as any).ethereum
    ) {
      const provider = (globalThis as any).ethereum;
      return this.sendWithGivenProvider(provider, payload, callback);
    } else {
      throw new Error(`No provider available for method: ${payload.method}`);
    }
  }

  sendDefaultRequest(payload: object, callback: AsyncCallback) {
    ky.post(this.url, {
      json: payload,
      retry: this.retryOptions,
    })
      .json()
      .catch(handleMaybeJSONError)
      .then(
        result => {
          callback(null, result);
        },
        error => {
          callback(error);
        },
      );
  }

  sendWithGivenProvider(
    provider: { send?: SendMethod; sendAsync?: SendMethod },
    payload: Payload,
    callback: AsyncCallback,
  ) {
    const execute = provider.sendAsync || provider.send;
    if (!execute) {
      throw new Error(
        'Provider is expected to implement either send or sendAsync method.',
      );
    }
    execute.call(provider, payload, callback);
  }
}
