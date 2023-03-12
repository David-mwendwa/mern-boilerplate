incase of "Error: error:0308010C:digital envelope routines::unsupported" error,

You can try one of these:

1. Downgrade to Node.js v16.

You can reinstall the current LTS version from Node.js’ website.

You can also use nvm. For Windows, use nvm-windows.

2. Enable legacy OpenSSL provider.

On Unix-like (Linux, macOS, Git bash, etc.):
export NODE_OPTIONS=--openssl-legacy-provider

On Windows command prompt:
set NODE_OPTIONS=--openssl-legacy-provider

On PowerShell:
$env:NODE_OPTIONS = "--openssl-legacy-provider"
