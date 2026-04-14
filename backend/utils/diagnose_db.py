import os
import sys
import ssl
import socket
try:
    import pymongo
    import certifi
    import dns.resolver
    from dotenv import load_dotenv
except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    sys.exit(1)

def diagnose():
    load_dotenv()
    print(f"Python version: {sys.version}")
    print(f"PyMongo version: {pymongo.version}")
    print(f"Certifi version: {certifi.version()}")
    print(f"OpenSSL version: {ssl.OPENSSL_VERSION}")
    
    uri = os.environ.get("MONGO_URI")
    if not uri:
        print("❌ MONGO_URI not found in environment")
        return

    # 1. Test DNS Resolution
    print("\n--- DNS Resolution ---")
    try:
        host = uri.split('@')[-1].split('/')[0].split('?')[0]
        print(f"Resolving {host}...")
        answers = dns.resolver.resolve(host, 'SRV')
        for rdata in answers:
            print(f"  SRV Target: {rdata.target} Port: {rdata.port}")
    except Exception as e:
        print(f"❌ DNS Resolution failed: {e}")

    # 2. Test TCP Connection to one of the nodes
    print("\n--- TCP Connectivity ---")
    # Real targets from the terminal error:
    targets = [
        "ac-ocatgl9-shard-00-00.coo1xkb.mongodb.net",
        "ac-ocatgl9-shard-00-01.coo1xkb.mongodb.net",
        "ac-ocatgl9-shard-00-02.coo1xkb.mongodb.net"
    ]
    for target in targets:
        try:
            print(f"Testing TCP connection to {target}:27017...")
            s = socket.create_connection((target, 27017), timeout=5)
            print(f"  ✅ Connected to {target}")
            s.close()
        except Exception as e:
            print(f"  ❌ Failed to connect to {target}: {e}")

    # 3. Test SSL Handshake
    print("\n--- SSL Handshake ---")
    for target in targets:
        try:
            print(f"Testing SSL handshake with {target}:27017...")
            context = ssl.create_default_context(cafile=certifi.where())
            s = socket.create_connection((target, 27017), timeout=5)
            with context.wrap_socket(s, server_hostname=target) as ss:
                print(f"  ✅ SSL Handshake successful with {target}")
                print(f"  SSL Version: {ss.version()}")
        except Exception as e:
            print(f"  ❌ SSL Handshake failed with {target}: {e}")

if __name__ == "__main__":
    diagnose()
