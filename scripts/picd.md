# picd

### what is picd?
 picd (short for pico-down) is a minimal markdown language, custom made for writing nice looking blog posts easily.

### rules:
- metadata is defined using a '#' at the beginning of the line. It must be defined at the start of the file. For example, `#title what a nice day!` would effectively do `meta["title"] = "what a nice day"`
- common text modifications are possible as normal, such as `*italics*`, `**bold**`, and `_underline_`
- headers look like `@h generic beeg header` or `@h3 a smaller header`.
- special characters (`{ } # \ * _ @`) can be escaped using a slash, like `#35f{blue stuff. \{ help, i'm trapped. and still blue \} }`
- text can be easily colored using color codes such as `#f11{this is something evil!}` or `#63c74d{these are very} #3e8948{particular colors} #265c42{of green}`
- we can define lists using `n.` where n is an integer or letter or `-`
- we can apply styles to groups of text by using `@style rest of the line` or `@style{just a group of text}`.
- `@line` at the start of a line draws a horizontal line
