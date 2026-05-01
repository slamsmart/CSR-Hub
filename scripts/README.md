`sum-openai-usage.ts` menjumlahkan token dari file JSON atau NDJSON yang berisi objek `usage`.

Contoh:

```bash
npm run usage:sum -- openai-log.json
npm run usage:sum -- logs/debug.ndjson logs/retry.ndjson
```
