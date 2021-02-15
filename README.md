# Atlas : Intelligence for CAST Imaging

## Introduction 

The Atlas Platform is a project whose ambition is to industrialize the actions on Imaging by offering a user-friendly interface for _Demeter_ and _Artemis_
It regroups for the moment the following extensions : 
- [Demeter : Intelligence for Imaging ](https://github.com/CAST-Extend/com.castsoftware.uc.demeter/wiki)
- [Artemis : Automatic Framework Detector ](https://github.com/CAST-Extend/com.castsoftware.uc.artemis/wiki)

## Compatibility
### CAST Imaging compatibility
This extension was tested on CAST Imaging 2.0 & 2.1.0.  
It necessitates the version 4.0 or superior of the Neo4j database 

## How to install the extension

### Install Demeter & Artemis
Make sure you've already installed _Demeter_ and _Artemis_. 
If you need more information on how to install them, please check these links: 
- [How to install Demeter](https://github.com/CAST-Extend/com.castsoftware.uc.demeter/wiki/Install-the-extension)
- [How to install Artemis](https://github.com/CAST-Extend/com.castsoftware.uc.artemis/wiki/Install-the-extension)

💡 You can find the newer version of these extensions in the `extension/` folder once the zip is extracted.

### Install the Atlas platform
Run Atlas.exe and choose the folder where you want Atlas to be extracted.
Once the operation is done, navigate to the folder: 

#### What's in my installation package ?
- The atlas application
- node-v14.15.4-x64.msi, the official Node.js installer 
- NSSM.exe The non-sucking service manager
- This read me file
- A copy of the GNU LGPL 3 in the license folder/
- The launch script `run.bat`

#### Install Node.js 

- Install Node.js on your machine, using the node-v14.15.4-x64.msi installer.  
Follow the different steps of the wizard.

## Launch the Atlas platform
**Automatic**  
Open a command prompt in the Atlas directory and run `.\run.bat`

**Manual operations**
- Open a command prompt ( or Powershell ) in the `server/` folder
- Execute the two following command :
  - `npm install -g module-alias`
  - `npm install`
- To launch the server, you can now execute in the same console `npm run start`

## How to use the plateform

Please refer to the Wiki of this repository for more information on how to use the extension

## Known issues
None

## Roadmap

### Future releases
- More documentation 
- More actions of Demeter ( Statistic generator ) 
- More agents

## Release Notes
### Version 2.0.0
- Better Artemis support ( More screens, and configuration)
- Bug fixing
- Better API
- More documentation !

### Version 1.0.0
- Atlas platform
- Artemis binding 
- Demeter binding

## Contributing to the project 

Any help or recommendations regarding this project will be welcome and appreciated.
Feel free to get in touch with me on Github!
