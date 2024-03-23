---
title: Generating Code
date: 2021-09-30
draft: false
summary: Let's talk about code generation!
---

# Generating Code

At my day job at Google, I spend a lot of time generating code. Coming from
outside of Google, this wasn't something I had ever thought about doing.
Computers writing code for other computers to run has a very Skynet feel to it
and sounded too complicated to ever be worth the effort.
Yet, this practice is so commonplace that there's [built-in
support](https://docs.bazel.build/versions/main/be/general.html#genrule) for it
in Google's build system.

Quick preface: I'm talking about writing a computer program that outputs
some kind of file that's funny designed to be read in by a compiler or
interpreter. I'm not talking about writing data files or schema files. It feels
natural for computers to be writing those, since they broadly match up with the
native data types found in programming languages.

## Why Generate Code?

My team at Google is responsible for building open source support for all of
Google Cloud's different resource types for various declarative tooling like
[Terraform](https://github.com/hashicorp/terraform-provider-google) or
[Ansible](https://github.com/ansible-collections/google.cloud). We've even
open-sourced one of our [code
generators](https://github.com/GoogleCloudPlatform/magic-modules) if you'd like
to take a look!

If you haven't seen GCP lately, there's an unbelievable amount of resource types
(in the order of hundreds!). Everytime a user wishes to work with a resource of
a certain type in one of those tools, there has to be code in that cool that
handles that particular resource type.

Writing support for each of these resource types looks pretty
similar. They all follow the same rough logic:

- A user needs a cloud resource to exist in a certain manner
- The tool calls that cloud resource's GET API to see if the resource exists.
- If it doesn't, the tool calls the resource type's Create API.
- If the resource does exist, the tool checks to see if the user's preferences
  differ from whatever the resource currently has.
- If it does, the update API gets called.

You might first think that we need a function to handle this. The function could
take in the user's intention and links to Get/Create/Update APIs. But, as time
goes on, you realize that some resources handle the creation process slightly
different from others. Then, every resource type expresses their current state
(from the GET API) slightly differently from each other. That makes handling the
"check if user's preferences are different" phase slightly different for each
resource. As you go on, you realize that parts of each resource type's code will
be identical to all the others and other parts will be radically different.

Each resource type also needs to have a file with a handful of boilerplate
methods defined. No amount of functional or class abstraction can change the
fact that our team needs to write out all of those boilerplate methods...and
that's before the fact that we realize that the boilerplate isn't just
copy-paste.

Doing this once or twice is interesting! Doing it a dozen or so times feels
monotonous, especially once you realize that you made the same bug in all dozen
resource types and have to make the same fix twelve times. Now, imagine doing
it a hundred times.

Code generation lets us create a source-of-truth for all this boilerplate.

## How to Generate Code

There's several different approaches to code generation.

- **Compiler Magic:** You could programmatically build out the proper Abstract
  Syntax Tree and then rely on the compiler to either output the AST as code or
  just run the AST directly. I suspect that most people handle code generation
  with some amount of this. That's not actually the method I'm going to be
  talking about. While you don't have to have a compiler background to do this,
  it does require knowledge of your language's internals. Testing will be more
  straightforward of any of these.

- **AI/ML:** Oh, please no! Take that witchcraft away and back to the godless
  land from which it was brewed. Seriously though, it's really hard to have any
  insight into what a ML model is doing or how to debug it. Your training data
  is probably going to look a lot like your final product, which sort of
  defeats the purpose of automation.

While many people will take one of these approaches (especially the first one),
we've chosen not to. We actually take a third approach: templating.

## Templated Approach

The approach we take is essentially Mad Libs.

<img src="/codegen.png" class="img-fluid hero-image" alt="Codegen example">

You have a text file that looks something like code. At the same time, you have
a pile of parameters. Your code generator is responsible for taking parameters,
injecting them into your code template, and then writing the resulting file.
It's Mad Libs!

We primarly use templates for ease of iteration. We can make most changes to the
templates easily and be reasonably certain that the resulting code will appear
as we intend. Refactoring the generated code can be done at the template level
and doesn't require large generator rewrites. We can also programatically
generate anything we want. We can use the same sets of primatives and
infrastructure to create Markdown documentation, Go code, Python code,
protobufs, YAML files and anything in between. 

The downside to this approach is that the templates can grow unwiedy. As we
discover more places where customizations need to occur, those customizations
become embedded into our templates. IDEs have poor support for understanding
template syntax, leaving it up to the team to carefully parse our templates and
understand what's happening.

## Abstractions: When to Generate?

Typically, when writing code, we think about abstractions. We start out with a
list of instructions. We can create functions, which abstract away those list
of instructions. Then, we can create classes, which abstract away both the
functions and the underlying data used by the functions. Code generation acts
as a layer on top of all of these.

Because of this, we're constantly asking ourselves if we're using the right
abstraction. Human-written code is easy to test. Generated code is easy to
test, but the generator itself is hard to test. This means that we're always on
the hunt for more edge cases in generated code, so we can improve the generator
better.

I suspect that this is why using "compiler magic" is so much more tenable for
teams. It's easier to write unit tests when you have handfuls of functions that
all alter an AST. That's how developers learn to write code! Write a function
and then write a text for that function. A template approach means that most of
the true "logic" of your program is embedded inside a templating library that
you have no insight into. You can test the end result, but you can't easily
inject tests into anything in the middle.

Our team does rewrites where we take a large amount of template, write a
function that replicates that template at runtime, and then replace the
template with a single line of template code. We can more easily test our
handwritten function. At that point, we just have to make sure that the
template places the correct values into the function.