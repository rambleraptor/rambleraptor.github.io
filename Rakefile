# == Dependencies ==
require 'rake'
require 'yaml'
require 'fileutils'
require 'rbconfig'

# == Configuration ==
task :default => :watch

CONFIG = YAML.load_file("_config.yml")
DATE = Time.now.strftime("%Y-%m-%d")
DATE_LONG = Time.now.strftime("%B %d, %Y")


POSTS = "_posts"
DRAFTS = "_drafts"

# == Helpers ==

def check_title(title)
    if title.nil? or title.empty?
        raise "Please add a title to your file"
    end
end

def transform_to_slug(title, extension)
    characters = /("|'|!|\?|:|\s\z)/
    whitespace = /\s/
    "#{title.gsub(characters, "").gsub(whitespace, "-").downcase}.#{extension}"
end
def create_file(directory, filename, content, title)
    if File.exists?("#{directory}/#{filename}")
        raise "The file already exists"
    else
        write_file(content, title, directory, filename)
    end
end

def write_file(content, title, directory, filename)
    parsed_content = "#{content.sub("title:", "title: #{title}")}"
    parsed_content = "#{parsed_content.sub("date:", "date: #{DATE_LONG}")}"
    File.write("#{directory}/#{filename}", parsed_content)
    puts "#{filename} was created in '#{directory}'."
end

def read_file(template)
    File.read("_#{template}_template.md")
end

def create_post(title, template, extension)
    check_title(title)
    filename = "#{DATE}-#{transform_to_slug(title, extension)}"
    content = read_file(template)
    create_file(POSTS, filename, content, title)
end
# == Tasks ==

desc "Create a post in _posts"
task :post, :title do |t, args|
    title = args[:title]
    template = CONFIG["post"]["template"]
    extension = CONFIG["post"]["extension"]
    create_post(title, template, extension)
end
