// sslpin_bypass_native.js
// Étape 6 - Bypass Natif (BoringSSL / OpenSSL)

function hook(name, lib){
  const addr = Module.findExportByName(lib || null, name);
  if (!addr) return console.log('[*] no ' + name);
  
  Interceptor.attach(addr, {
    onLeave(rv){
      if (name === 'SSL_get_verify_result'){
        console.log('[+] SSL_get_verify_result -> X509_V_OK (Forcé)');
        rv.replace(ptr(0)); // 0 = X509_V_OK
      }
    }
  });
  console.log('[+] Hooked ' + name);
}

// On tente de hooker sur les bibliothèques courantes
hook('SSL_get_verify_result', 'libssl.so');
hook('SSL_get_verify_result', 'libboringssl.so'); 
