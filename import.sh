rm -rf build
mkdir build
cd build
git clone https://github.com/tailuge/billiards.git
cd billiards
npm install -g grunt-cli
npm install
grunt requirejs:compile
grunt copy

