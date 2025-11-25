+++
title = "Many Pictures"
date = 2023-07-20
description = "A screensaver using Pixabay's API to automagically scroll through images"
[taxonomies]
tags=["software"]
+++

Generating a random image is fun; you never know what you're going to get! I've always thought it would be an interesting screensaver, so I made <a href="https://many-pictures.github.io/">a small static site</a> to do just that.

<h3 id="the-problem" style="margin-top: 24px;">The problem</h3>

At 100 queries per day, the <a href="https://developers.google.com/custom-search/v1/overview#pricing">free API</a> provided by Google image search won't work. A screensaver needs to be constantly producing interesting stuff! However, anyone can make requests to google images from a browser for free. We can take the straight forwards approach and "reverse engineer" the google search bar by making an HTTP request with the following query:

<div style="display: flex; flex-direction: row; align-items: center; justify-content: center; margin: 1em 0;">
    <div class="multiline-code" style="display: inline;">
        https://www.google.com/search?<span style="color: var(--soft-green);">q=your+search+query+here</span>&tbm=isch
    </div>
    <a class="tooltip" style="margin-left: 6px;">[1]<span class="tooltip-text">That last part <code>&tbm=isch</code> tells google to only search images.</span></a>
</div>

In my experience, this approach can fail inconsistently and tends to only get poor quality images. The higher quality version of an image likely requires some amount of additional steps that javascript performs when in browsers.

But there's a different approach. To beat both issues, I looked into <a href="https://pixabay.com/">Pixabay</a>, a great website for finding free photos submitted by users. Most of these photos are pretty high in quality, given that they're forced to go through a layer of <a href="https://pixabay.com/images/tools/quality_rating/">community voting</a> first. And it just so happens that Pixabay has a really nice <a href="https://pixabay.com/service/about/api/">free API</a> that fit my purposes!

<h3 id="how-does-it-work" style="margin-top: 24px;">How does it work?</h3>

Many Pictures is a screensaver website that uses Pixabay's public API to automatically scroll through images. It's purpose is for when you have an idle computer, such as a shared computer in a public space. The current version of Many Pictures scrolls through images in chronological order, so it never repeats.

You can also use the mouse's scroll wheel to increase and decrease the scroll speed.

<div style="width: 60%; margin: 24px auto 0 auto;">
    <img style="width: 100%;" src="/images/blog/many-pictures/example_921.png"></img>
    <p class="img-desc">Image 921 added to Pixabay, including the layout of Many Pictures</p>
</div>

<h3 id="more-problems" style="margin-top: 24px;">More problems</h3>

Pixabay's free API has a limit of 100 requests per minute. If the scroll speed ever loads images faster than once per <code>600ms</code>, Many Pictures will detect it using a geometric average and throttle the scroll speed accordingly.

<div style="width: 90%; margin: 24px auto 24px auto;">
    <img style="width: 100%;" src="/images/blog/many-pictures/timing_data.png"></img>
    <p class="img-desc">The geometric average time vs the exact time the image took to load, with scroll speed at the bottom</p>
</div>

You can see in the above chart that the geometric average helps rough out any speedups / slowdowns caused by the time it takes to download each image. When recording this data, I only ever increased the scroll speed, while the algorithm slowed it down. You can see this on the bottom half of the chart.

A nice side-effect of this approach is that slowdowns are somewhat smooth, and typically occur all at once.

<h3 id="try-it-out" style="margin-top: 24px;">Try it out</h3>

To use Many Pictures you need your own API key. 100 images per minute is too shallow of a limit for more than a few people to use at a time, but luckily Pixabay API keys are free! Follow these steps to grab your own key & plug it into Many Pictures.

<ul>
    <li>Go to <a href="https://pixabay.com/api/docs/">https://pixabay.com/api/docs/</a></li>
    <li>Create a free account & login</li>
    <li>Ctrl+F "Your API key:" & copy the key (highlighted in green)</li>
    <li>Go to <a href="https://many-pictures.github.io/">https://many-pictures.github.io/</a> and input your api key in the top input box</li>
    <li>Press enter</li>
    <li>Enjoy!</li>
</ul>

<div style="width: 60%; margin: 24px auto 24px auto;">
    <img style="width: 100%;" src="/images/blog/many-pictures/example_many.gif"></img>
    <p class="img-desc">woooooo~</p>
</div>

<p>
    Feel free to check out this website's source on <a href="https://github.com/many-pictures/many-pictures.github.io">GitHub</a> if you'd like to see how I used the Pixabay API, or have any other questions
</p>