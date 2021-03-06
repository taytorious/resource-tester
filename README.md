##Resource Tester

PhantomJS tool that measures pageload performance and allows you to target individual reources on a page. This tool will
capture hundreds of data points for a given URL in minutes. Output is JSON configurable and displayed in a Google Graph.

Extension of [https://github.com/loadfocus/pageloadtime](https://github.com/loadfocus/pageloadtime)

##What these scripts can measure:

* Page load times
* Size and number of resources retrieved for URL call
* Load time for each resource
* Great for measuring pageload consitency with different features in place



##Sample Output:

![](img/sample.png?raw=true)

In this case, we are comparing the performance of a page loading a resource (global.js) sync vs async. The first
graph shows that DOM interactive is much more consistent when global.js is loaded async. The second graph shows
performance metrics specific to global.js.


##Quick Start

Install PhantomJS 1.9.8.

    brew install homebrew/versions/phantomjs198

Clone the repo

    git init
    git clone git@github.com:taytorious/resource-tester.git

If you wish to use your own phantomJS configuration, edit the phantomConfig.json file to your liking.

Run the PhantomJS tool. Be sure to namespace your report files.

    sh load.sh <url> <number of runs> <path to phantom> <report filename>

Example:

    sh load.sh http://www.doctoroz.com 30 phantomjs test1


Edit the config.json file to target the resources and browser events of your choosing. The config is setup for two graphs:
one for page metrics (main) and one for target resource metrics (targets).

```javascript
{
  "configs": {
    "main": {
      "resourceGraph": false,
      "targets": [              // page metrics to target

        {
          "name": "",           // Name is any of the supported page metrics. See below.
          "title": ""           // Event display name on the graph
        }
      ],
      "options": {
                                // Google Graph options
      }
    },
    "targets": {
      "resourceGraph": true,
      "metrics": [],            // size, duration, and/or end
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


##Supported Page Metrics

* elapsedLoadTime
* totalResourceTime
* numberOfResources
* totalResourceSize
* domReadystateInteractive
* domReadyStateLoading
* nonReportingResources

##Supported Resource Metrics

* `size` - Resource size
* `duration` - Request duration
* `end` - Time from initial pageload to request end


##TODO:

Refactor using phantomJS 2 and the Navigation Timing API


