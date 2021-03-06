# DLP-for-SaaS

## Installation

To install the created solution download [this package](https://github.com/DvorakHonza/Files/blob/main/DlpForSaasPackage.zip?raw=true), that contains installation scripts, precompiled native host and other files necessary for instalation.

1. Unzip the downloaded package.
2. Open command line and navigate to the unzipped folder 
3. Run the init_db.bat script with a path as first argument, which specifies the folder where the database file will be saved. Use '.' (dot character) to create the database in current folder. Adjust the DatabaseLocation property in settings.json file to correspond to the path provided to the init_db.bat script.
```batch
    init_db.bat <path>
```
4. Run the install.bat script. This script sets required registry values.
5. Set settings in the settings.json file and run the setSettings.ps1 script
6. Launch chrome browser, extension should be installed (might take a couple seconds after first start)

## Configuration

Settings for the extension are read from settings.json file and written to registry.

* "DatabaseLocation" - contains path to the database file, used by NativeHost
* "Policy" - contains policies set for the extension
    * SafeStorage - an array of cloud storages considered as safe
    * StoragePolicySettings - policies for individual channels
        * upload - 0 = Log, 1 = Notify and Log, 2 = Block, Notify and Log
        * clipboard - 0 = Log, 1 = Notify and Log, 2 = Block, Notify and Log
        * screenCapture - 0 = Log, 1 = Notify and Log, 2 = Block, Notify and Log

## Uninstallation

1. Run the uninstall.bat script to clear set registry values and uninstall the extension.
2. Delete the unzipped files.