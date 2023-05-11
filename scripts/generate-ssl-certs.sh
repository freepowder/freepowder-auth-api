#!/bin/bash

if [ ! -e ../src/index.ts ]
then
	echo "Error: could not find main application index.ts file"
	echo "You should run the generate-ssl-certs.sh script from the main MEAN application root directory"
	echo "i.e: bash scripts/generate-ssl-certs.sh"
	exit -1
fi

echo "Generating self-signed certificates..."
mkdir -p ../src/config/sslcerts
openssl genrsa -out ../src/config/sslcerts/key.pem 4096
openssl req -new -key ../src/config/sslcerts/key.pem -out ../src/config/sslcerts/csr.pem
openssl x509 -req -days 365 -in ../src/config/sslcerts/csr.pem -signkey ../src/config/sslcerts/key.pem -out ../src/config/sslcerts/cert.pem
rm ../src/config/sslcerts/csr.pem
chmod 600 ../src/config/sslcerts/key.pem ../src/config/sslcerts/cert.pem
