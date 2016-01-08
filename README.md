M.Sc. in Applied Science Thesis
===============================
 
This repo represents the work completed in partial fufilment of a Masters of Science in Applied Science at Saint Mary's University.

As this repo may change over time, the following is a link to the version of this work as it was when printed and bound:

[https://github.com/valencik/mastersAPSC/releases/tag/v1.0](https://github.com/valencik/mastersAPSC/releases/tag/v1.0)


Installation
------------

All development was completed on MAc OS X 10.10.
Although it should run on linux, the following instructions are Mac specific.

The database used is MongoDB, which is available on [Homebrew](http://brew.sh).

```
brew install mongodb
```

The code in this work uses Python3, R and Perl (the system default was fine).

```
brew install python3 r
```

The python libraries are installable via pip.

```
pip install -r requirements.txt
```

The database is populated using the [prepare-data.py](https://github.com/valencik/mastersAPSC/blob/master/data/prepare-data.py) script.

```
cd data
python3 prepare-data.py
```


Usage
-----

Make sure the MongoDB service `mongod` is running.

The [nsr_app.py](https://github.com/valencik/mastersAPSC/blob/master/web/nsr_app.py) script launches the web app.

```
python3 nsr_app.py
```
