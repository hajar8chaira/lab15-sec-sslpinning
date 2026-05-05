// sslpin_bypass_universal.js
// VERSION ULTRA-STABLE POUR LE LAB 15

setTimeout(function() {
    Java.perform(function() {
        console.log("[*] DÉMARRAGE DU BYPASS STABLE...");

        // 1. Force Proxy (Burp)
        try {
            var OkHttpClientBuilder = Java.use('okhttp3.OkHttpClient$Builder');
            var Proxy = Java.use('java.net.Proxy');
            var InetSocketAddress = Java.use('java.net.InetSocketAddress');
            var ProxyType = Java.use('java.net.Proxy$Type');
            var proxyAddr = InetSocketAddress.$new("10.0.2.2", 8080);
            var myProxy = Proxy.$new(ProxyType.valueOf("HTTP"), proxyAddr);
            
            OkHttpClientBuilder.proxy.implementation = function(p) {
                console.log("[+] PROXY REDIRIGÉ VERS BURP");
                return this.proxy(myProxy);
            };
        } catch (e) { console.log("[-] OkHttp Proxy Hook impossible"); }

        // 2. Bypass OkHttp Pinning
        try {
            var CertificatePinner = Java.use('okhttp3.CertificatePinner');
            CertificatePinner.check.overloads.forEach(function(ov) {
                ov.implementation = function() {
                    console.log("[+] BYPASS: OkHttp Pinning");
                    return;
                };
            });
        } catch (e) { console.log("[-] OkHttp Pinner Hook impossible"); }

        // 3. Bypass Système (Conscrypt)
        try {
            var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
            TrustManagerImpl.checkServerTrusted.overloads.forEach(function(ov) {
                ov.implementation = function() {
                    console.log("[+] BYPASS: TrustManager Système");
                    var ArrayList = Java.use('java.util.ArrayList');
                    return ArrayList.$new();
                };
            });
        } catch (e) { console.log("[-] TrustManager Hook impossible"); }

        console.log("[*] SCRIPT ACTIF. VOUS POUVEZ CLIQUER.");
    });
}, 500); // On attend 0.5s pour laisser l'app démarrer tranquillement
