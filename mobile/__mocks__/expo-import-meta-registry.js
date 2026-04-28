"use strict";
// Minimal stub for expo/src/winter/ImportMetaRegistry.
// The real module is lazily required by a global getter installed in expo's
// winter runtime; Jest 30 rejects that lazy require as "outside scope".
// This stub satisfies the ImportMetaRegistry shape without triggering the issue.
module.exports = {
  ImportMetaRegistry: { url: null },
};
