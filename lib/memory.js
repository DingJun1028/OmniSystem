'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashLock(entry) {
  const material = JSON.stringify({
    content: entry.content,
    tags: entry.tags || [],
    source_origin: entry.source_origin,
  });
  return crypto.createHash('sha256').update(material).digest('hex').slice(0, 16);
}

// 萬能記憶樞紐（第 2 層）— 5T 治理存證：每筆記憶帶 Hash Lock
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

  store(entry) {
    const record = {
      memory_id: 'mem_' + crypto.randomUUID().slice(0, 8),
      memory_type: entry.memory_type,
      content: entry.content,
      tags: entry.tags || [],
      confidence: entry.confidence != null ? entry.confidence : 1,
      source_origin: entry.source_origin || 'unknown',
      created_at: Date.now(),
      hash_lock: '',
    };
    record.hash_lock = hashLock(record);
    this.entries.push(record);
    if (this.entries.length > 500) this.entries = this.entries.slice(-500);
    this._save();
    return record;
  }

  search(text) {
    const words = String(text)
      .toLowerCase()
      .split(/[^0-9a-z\u4e00-\u9fff]+/)
      .filter((w) => w.length > 1);
    if (!words.length) return [];
    return this.entries
      .filter((e) => words.some((w) => JSON.stringify(e.content).toLowerCase().includes(w)))
      .slice(-5)
      .reverse();
  }

  recent(n) {
    return this.entries.slice(-n).reverse();
  }
}

module.exports = MemoryVault;
