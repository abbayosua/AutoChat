'use client'

import { useState, useEffect, useCallback } from 'react'
import { SidebarNav } from '@/components/organisms/sidebar-nav'
import { HeaderBar } from '@/components/organisms/header-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, BookOpen, Eye, Plus, Clock, Tag, Loader2 } from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  category: string
  tags?: string
  viewCount: number
  createdAt: string
  updatedAt?: string
}

export default function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [notificationCount, setNotificationCount] = useState(0)

  const fetchArticles = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      
      const response = await fetch(`/api/knowledge?${params}`)
      const result = await response.json()
      if (result.success) setArticles(result.data)
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategory])

  const fetchNotificationCount = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications?unread=true')
      const result = await response.json()
      if (result.success && result.data) {
        setNotificationCount(result.data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }, [])

  useEffect(() => { 
    fetchArticles() 
    fetchNotificationCount()
  }, [fetchArticles, fetchNotificationCount])

  // Extract unique categories from articles
  const categories = ['all', ...new Set(articles.map(a => a.category))]

  // Filter articles by category client-side for smooth tab switching
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchArticles()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <SidebarNav activeRoute="/knowledge" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderBar notificationCount={notificationCount} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Knowledge Base
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Browse help articles and documentation
                </p>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="mb-6 p-4">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>
          </Card>

          {/* Category Tabs */}
          <div className="mb-6">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 dark:data-[state=active]:bg-teal-900/30 dark:data-[state=active]:text-teal-400"
                  >
                    {category === 'all' ? 'All Articles' : category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Articles Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <BookOpen className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No articles found</p>
                <p className="text-sm">Try adjusting your search or category filter</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-teal-300 dark:hover:border-teal-700 border-l-4 border-l-teal-500"
                  onClick={() => setSelectedArticle(article)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold line-clamp-2 text-gray-900 dark:text-white">
                        {article.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Excerpt */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {article.excerpt || article.content.substring(0, 100) + '...'}
                    </p>

                    {/* Category Badge */}
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {article.category}
                      </Badge>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{article.viewCount} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stats Footer */}
          {!isLoading && filteredArticles.length > 0 && (
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                Showing {filteredArticles.length} of {articles.length} articles
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {categories.length - 1} categories
              </span>
            </div>
          )}
        </main>
      </div>

      {/* Article Detail Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          {selectedArticle && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                  >
                    {selectedArticle.category}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                  {selectedArticle.title}
                </DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="max-h-[60vh] pr-4">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{selectedArticle.viewCount} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Created {formatDate(selectedArticle.createdAt)}</span>
                  </div>
                </div>

                {/* Tags */}
                {selectedArticle.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedArticle.tags.split(',').map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="text-gray-600 dark:text-gray-400"
                      >
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {selectedArticle.content}
                  </p>
                </div>
              </ScrollArea>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Was this article helpful?
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Yes, thanks!
                  </Button>
                  <Button variant="ghost" size="sm">
                    Not really
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
