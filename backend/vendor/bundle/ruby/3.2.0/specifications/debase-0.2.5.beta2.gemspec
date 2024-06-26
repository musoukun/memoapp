# -*- encoding: utf-8 -*-
# stub: debase 0.2.5.beta2 ruby lib
# stub: ext/extconf.rb ext/attach/extconf.rb

Gem::Specification.new do |s|
  s.name = "debase".freeze
  s.version = "0.2.5.beta2"

  s.required_rubygems_version = Gem::Requirement.new("> 1.3.1".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Alexandr Evstigneev".freeze, "Dennis Ushakov".freeze]
  s.date = "2021-01-12"
  s.description = "    debase is a fast implementation of the standard Ruby debugger debug.rb for Ruby 2.0+.\n    It is implemented by utilizing a new Ruby TracePoint class. The core component\n    provides support that front-ends can build on. It provides breakpoint\n    handling, bindings for stack frames among other things.\n".freeze
  s.email = ["hurricup@gmail.com".freeze, "dennis.ushakov@gmail.com".freeze]
  s.extensions = ["ext/extconf.rb".freeze, "ext/attach/extconf.rb".freeze]
  s.files = ["ext/attach/extconf.rb".freeze, "ext/extconf.rb".freeze]
  s.homepage = "https://github.com/ruby-debug/debase".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.0".freeze)
  s.rubygems_version = "3.4.10".freeze
  s.summary = "debase is a fast implementation of the standard Ruby debugger debug.rb for Ruby 2.0".freeze

  s.installed_by_version = "3.4.10" if s.respond_to? :installed_by_version

  s.specification_version = 4

  s.add_runtime_dependency(%q<debase-ruby_core_source>.freeze, [">= 0.10.12"])
  s.add_development_dependency(%q<test-unit>.freeze, [">= 0"])
  s.add_development_dependency(%q<rake>.freeze, [">= 0"])
end
