'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 5T 治理存證：每筆記憶帶 Hash Lock（Traceable / Trackable / Tangible / Transparent / Trustworthy）
function hashLock(entry) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify({ content: entry.content, tags: entry.tags || [], source_origin: entry.source_origin }))
    .digest('hex')
    .slice(0, 16);
}

class MemoryVault {
  constructor(dir) {
    this.file = path.join(dir, 'memory.json');
    this.entries = [];
    try {
      fs.mkdirSync(dir, { recursive: true });
      if (fs.existsSync(this.file)) {
        this.entries = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      }
    } catch (err) {
      console.error('memory vault init failed:', err.message);
    }
  }

  _save() {
    fs.writeFileSync(this.file, JSON.stringify(this.entries, null, 2));
  }

  store({ content, tags = [], source_origin = 'unknown' }) {
    const record = {
      memory_id: 'mem_' + crypto.randomUUID().slice(0, 8),
      content,
      tags,
      source_origin,
      hash_lock: hashLock({ content, tags, source_origin }),
      stored_at: new Date().toISOString(),
    };
    this.entries.push(record);
    this._save();
    return record;
  }

  recall(text) {
    const words = String(text).split(/[\s,，。;；、]+/).filter((w) => w.length >= 2);
    if (!words.length) return [];
    const hits = [];
    for (const e of this.entries) {
      if (hits.some((h) => h.memory_id === e.memory_id)) continue;
      if (words.some((w) => e.content.includes(w))) hits.push(e);
    }
    return hits.slice(-3);
  }

  recent(n = 20) {
    return this.entries.slice(-n).reverse();
  }
}

module.exports = MemoryVault;
