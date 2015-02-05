---
title: Example API
template: page.hbt
---

API Example Calls
=================

The following are some example API calls.
The web application gets its data through very similar API calls.
That said, the end user should never have to worry about these technical details.
In the future these types of calls might become a private API, and instead a NSR specific
API might be exposed to the end user and web app.


### Example `findOne` API Query

Request: [http://localhost:8080/api/v1/NSR/findOne?query={"authors":"M.H.Becquerel"}](http://localhost:8080/api/v1/NSR/findOne?query={"authors":"M.H.Becquerel"})

Response:

```json
{
  "_id": "1896BE01",
  "year": 1896,
  "history": [
    "A20110406"
  ],
  "code": "JOUR CRPOB 122 420",
  "type": "JOUR",
  "REFRENCE": "C.R.Physique 122, 420 (1896)",
  "authors": [
    "M.H.Becquerel"
  ],
  "title": "Sur les radiations emises par phosphorescence"
}
```


### Example `find` API Query

Request: [http://localhost:8080/api/v1/NSR/find?query={"authors":"M.H.Becquerel"}](http://localhost:8080/api/v1/NSR/find?query={"authors":"M.H.Becquerel"})

Response:

```json
[
  {
    "_id": "1896BE01",
    "year": 1896,
    "history": [
      "A20110406"
    ],
    "code": "JOUR CRPOB 122 420",
    "type": "JOUR",
    "REFRENCE": "C.R.Physique 122, 420 (1896)",
    "authors": [
      "M.H.Becquerel"
    ],
    "title": "Sur les radiations emises par phosphorescence"
  },
  {
    "_id": "1896BE02",
    "year": 1896,
    "history": [
      "A20110406"
    ],
    "code": "JOUR CRPOB 122 501",
    "type": "JOUR",
    "REFRENCE": "C.R.Physique 122, 501 (1896)",
    "authors": [
      "M.H.Becquerel"
    ],
    "title": "Sur les radiations invisibles emises par les corps phosphorescence"
  }
]
```


### Example `aggretate` API Query

Request: [http://localhost:8080/api/v1/NSR/aggregate?pipeline=[{"$match": {"year": 1934}},{"$unwind": "$authors"},{"$group": {"_id": "$authors", "total": {"$sum": 1}}},{"$sort": {"total": -1} },{"$limit": 5}]](http://localhost:8080/api/v1/NSR/aggregate?pipeline=[{"$match": {"year": 1934}},{"$unwind": "$authors"},{"$group": {"_id": "$authors", "total": {"$sum": 1}}},{"$sort": {"total": -1} },{"$limit": 5}])

Response:

```json
[
  {
    "_id": "H.Schuler",
    "total": 5
  },
  {
    "_id": "E.Rutherford",
    "total": 2
  },
  {
    "_id": "H.Gollnow",
    "total": 2
  },
  {
    "_id": "K.R.More",
    "total": 2
  },
  {
    "_id": "H.Kopfermann",
    "total": 2
  }
]
```
