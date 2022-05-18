## imaginary.stripmall.software

This is, or hopefully one day, will be a full drop in replacement for cloudinary, the most excellent, albeit expensive image transformation and hosting service.

I've released this under the Open Software License 3.0  in order to encourage people to contribute to the codebase.


## Batteries Not Included

I put this into production on gcloud, using the google application engine and gcloud buckets for storage. Putting this behind cloudflare caching makes the solution almost as performant as cloudinary. Tooling for gcloud is included in the repository.

![Alt text]("gcloud.png")

Doing this, lowered my monthly image processing costs from over a thousand dollars to about one hundred and fifty dollars.

I've published a recipe for my setup here. I imagine many others are possible, for example using aws S3 and lambda functions (though I'm a bit concerned about the way CloudFront handles caching). 

I look forward to seeing contributions on this front. If you come up with one, and want help creating an article or post.





