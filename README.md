# Quickscan Central
An Electron wrapper application to provide interactivity with Opticon's OPN-2001 devices.

## Resources
A spin-off of the Python version found [here](https://majid.info/blog/a-python-driver-for-the-symbol-cs-1504-bar-code-scanner/).

## Building Project
1.  Install all modules using `npm install`
2.  Run `npm package` to create the packaged application in the `builds/` directory.
3.  Rename packaged application folder to **QuickscanCentral** to avoid the Squirrel dash in directory name issues.
4.  Run `npm complete` to create the installer in the `builds/` directory.  Any installer configurations can be found in the `installer.js` file.

## Troubleshooting
If having issues with building final installer package (using Squirrel), try stripping any dashes from path/app names.


## Contributors

Curtis Rodgers (me) : https://curtisrodgers.com