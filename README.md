##Oz Loadtester

PhantomJS tool that measures pageload performance and allows you to target individual reources on the page.

Sample Output:

![](img/sample.png?raw=true)


##Quick Start

Install PhantomJS 1.9.8.

    brew install homebrew/versions/phantomjs198

Clone the repo

    git init
    git clone https://git.alias.sharecare.com/tjohnson/oz-loadtest.git

If you wish to use your own phantomJS configuration, edit the phantomConfig.json file to your liking.

Run the PhantomJS tool. Be sure to namespace your report files.

    sh load.sh <url> <number of runs> <path to phantom> <report filename>

Example:

    sh load.sh http://www.doctoroz.com 30 phantomjs test1


Edit the config.json file to target the resources and browser events of your choosing. The config is setup for two graphs:
one for browser events (main) and one for target resources (targets).

```javascript
{
  "configs": {
    "main": {
      "resourceGraph": false,
      "targets": [              // Browser events to target

        {
          "name": "",           // Name is any of the supported browser events. See below.
          "title": ""           // Event display name on the graph
        }
      ],
      "options": {
                                // Google Graph options
      }
    },
    "targets": {
      "resourceGraph": true,
      "metrics": [],            // Array
      "targets": [              // Individual resources to target
        {
          "name": "",           // Name is any string in the resource URL that will identify it as that resource
          "title": ""           // Resource display name on the graph
        }
      ],
      "options": {
                                // Google Graph options
      }
    },
    "reports": [                // Array of reports to include in the graph
      {
        "name": "",             // Display name for the report
        "file": ""              // Path to the report
      },

    ]
  }
}
```


config.json example:

```json
{
  "configs": {
    "main": {
      "resourceGraph": false,
      "targets": [

        {
          "name": "domReadystateInteractive",
          "title": "DOM Ready Interactive"
        }
      ],
      "options": {
        "title": "DOMReadystateInteractive - Async vs Sync global.js",

        "hAxis": {
          "title": "Runs"
        },
        "vAxis": {
          "title": "Time (milliseconds)"
        }

      }
    },
    "targets": {
      "resourceGraph": true,
      "metrics": ["duration", "end"],
      "targets": [
        {
          "name": "global.js",
          "title": "Global JS"
        }
      ],
      "options": {
        "title": "Targets - Request Duration and Request End",
        "hAxis": {
          "title": "Runs"
        },
        "vAxis": {
          "title": "Time (milliseconds)"
        }
      }
    },
    "reports": [
      {
        "name": "Async Global JS",
        "file": "reports/async-globaljs.json"
      },
      {
        "name": "Sync Global JS",
        "file": "reports/sync-globaljs.json"
      }
    ]
  }
}
```

Start a server of your choosing to serve the results page locally.

    python -m SimpleHTTPServer 8000

Open a web browser and navigate to http://localhost:8000/results.html


##Supported Page Metics

    * elapsedLoadTime
    * totalResourceTime
    * numberOfResources
    * totalResourceSize
    * domReadystateInteractive
    * domReadyStateLoading
    * nonReportingResources

##Supported Resource Metrics

    * size      // Resource size
    * duration  // Request duration
    * end       // Time from initial pageload to request recieved


##What can these scripts measure:
    * page load time testing
    * size and number of resources retrieved for URL call
    * load time for each resource


##TODO:

Refactor using phantomJS 2 and the Navigation Timing API


