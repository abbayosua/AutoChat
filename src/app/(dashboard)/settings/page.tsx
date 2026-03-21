'use client'

import { useState, useEffect } from 'react'
import { SidebarNav } from '@/components/organisms/sidebar-nav'
import { HeaderBar } from '@/components/organisms/header-bar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Settings as SettingsIcon,
  Building2,
  Globe,
  Bell,
  Volume2,
  Sparkles,
  Brain,
  Save,
  Loader2,
  Shield,
  Palette,
  Key,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react'

interface Settings {
  companyName?: string
  timezone?: string
  language?: string
  emailNotifications?: string
  soundAlerts?: string
  aiAutoSuggestions?: string
  sentimentAnalysis?: string
}

interface AISettings {
  hasApiKey: boolean
  apiKeyPreview: string | null
  aiEnabled: boolean
  aiModel: string
}

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese (中文)' },
  { value: 'es', label: 'Spanish (Español)' },
  { value: 'fr', label: 'French (Français)' },
  { value: 'de', label: 'German (Deutsch)' },
  { value: 'ja', label: 'Japanese (日本語)' },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [aiSettings, setAiSettings] = useState<AISettings>({
    hasApiKey: false,
    apiKeyPreview: null,
    aiEnabled: true,
    aiModel: 'gemini-2.0-flash-lite'
  })
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isValidatingKey, setIsValidatingKey] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const result = await response.json()
        if (result.success) {
          setSettings(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
        toast({
          title: 'Error',
          description: 'Failed to load settings',
          variant: 'destructive',
        })
      }
    }

    const fetchAISettings = async () => {
      try {
        const response = await fetch('/api/ai/settings')
        const result = await response.json()
        if (result.success) {
          setAiSettings(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch AI settings:', error)
      }
    }

    Promise.all([fetchSettings(), fetchAISettings()]).finally(() => {
      setIsLoading(false)
    })
  }, [toast])

  // Update a setting locally (pending change)
  const updateSetting = (key: string, value: string) => {
    setPendingChanges((prev) => ({ ...prev, [key]: value }))
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  // Save a single setting
  const saveSetting = async (key: string, value: string) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      if (response.ok) {
        toast({
          title: 'Setting saved',
          description: 'Your changes have been saved successfully.',
        })
        // Clear pending change for this key
        setPendingChanges((prev) => {
          const updated = { ...prev }
          delete updated[key]
          return updated
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch {
      toast({
        title: 'Failed to save',
        description: 'Could not save your changes. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Save all pending changes
  const saveAllChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) return

    setIsSaving(true)
    try {
      const promises = Object.entries(pendingChanges).map(([key, value]) =>
        fetch('/api/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      )

      await Promise.all(promises)
      toast({
        title: 'All changes saved',
        description: 'Your settings have been updated successfully.',
      })
      setPendingChanges({})
    } catch {
      toast({
        title: 'Failed to save',
        description: 'Could not save some changes. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Save Gemini API key (BYOK)
  const saveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your Gemini API key.',
        variant: 'destructive',
      })
      return
    }

    setIsValidatingKey(true)
    try {
      const response = await fetch('/api/ai/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      })

      const result = await response.json()

      if (result.success) {
        setAiSettings(result.data)
        setApiKeyInput('')
        setShowApiKey(false)
        toast({
          title: 'API Key Saved',
          description: 'Your Gemini API key has been validated and saved successfully.',
        })
      } else {
        toast({
          title: 'Invalid API Key',
          description: result.error || 'The API key could not be validated. Please check and try again.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Failed to Save',
        description: 'Could not save your API key. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsValidatingKey(false)
    }
  }

  // Delete API key
  const deleteApiKey = async () => {
    try {
      const response = await fetch('/api/ai/settings', {
        method: 'DELETE',
      })

      if (response.ok) {
        setAiSettings(prev => ({ ...prev, hasApiKey: false, apiKeyPreview: null }))
        toast({
          title: 'API Key Removed',
          description: 'Your API key has been removed. A default key will be used for demo purposes.',
        })
      }
    } catch {
      toast({
        title: 'Failed to Remove',
        description: 'Could not remove your API key. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <SidebarNav activeRoute="/settings" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderBar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-teal-500 mx-auto" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <SidebarNav activeRoute="/settings" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderBar />

        {/* Settings Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Page Title */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <SettingsIcon className="h-6 w-6 text-teal-500" />
                Settings
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your account settings and preferences.
              </p>
            </div>
            {Object.keys(pendingChanges).length > 0 && (
              <Button
                onClick={saveAllChanges}
                disabled={isSaving}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save All Changes ({Object.keys(pendingChanges).length})
              </Button>
            )}
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 dark:data-[state=active]:bg-teal-900/30 dark:data-[state=active]:text-teal-400"
              >
                <Building2 className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 dark:data-[state=active]:bg-teal-900/30 dark:data-[state=active]:text-teal-400"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 dark:data-[state=active]:bg-teal-900/30 dark:data-[state=active]:text-teal-400"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Features
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 dark:data-[state=active]:bg-teal-900/30 dark:data-[state=active]:text-teal-400"
              >
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <div className="grid gap-6">
                {/* Company Settings */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                        <Building2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      Company Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your company information and branding.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-sm font-medium">
                          Company Name
                        </Label>
                        <Input
                          id="companyName"
                          placeholder="Enter your company name"
                          value={settings.companyName || ''}
                          onChange={(e) => updateSetting('companyName', e.target.value)}
                          className="max-w-md"
                        />
                        <p className="text-xs text-gray-500">
                          This name will appear in emails and reports.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Regional Settings */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                        <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      Regional Settings
                    </CardTitle>
                    <CardDescription>
                      Configure your timezone and language preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-sm font-medium">
                          Timezone
                        </Label>
                        <Select
                          value={settings.timezone || 'UTC'}
                          onValueChange={(value) => updateSetting('timezone', value)}
                        >
                          <SelectTrigger className="max-w-md">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            {timezones.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          All timestamps will be displayed in this timezone.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language" className="text-sm font-medium">
                          Language
                        </Label>
                        <Select
                          value={settings.language || 'en'}
                          onValueChange={(value) => updateSetting('language', value)}
                        >
                          <SelectTrigger className="max-w-md">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Choose your preferred display language.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <div className="grid gap-6">
                {/* Email Notifications */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                        <Bell className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      Email Notifications
                    </CardTitle>
                    <CardDescription>
                      Configure how and when you receive email notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications" className="text-sm font-medium">
                          Email Notifications
                        </Label>
                        <p className="text-xs text-gray-500">
                          Receive email notifications for new tickets and updates.
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settings.emailNotifications === 'true'}
                        onCheckedChange={(checked) => {
                          updateSetting('emailNotifications', String(checked))
                          saveSetting('emailNotifications', String(checked))
                        }}
                        className="data-[state=checked]:bg-teal-600"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email notification preferences
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <input
                            type="checkbox"
                            id="newTicket"
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            defaultChecked
                          />
                          <Label htmlFor="newTicket" className="text-sm">
                            New ticket assigned
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <input
                            type="checkbox"
                            id="customerReply"
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            defaultChecked
                          />
                          <Label htmlFor="customerReply" className="text-sm">
                            Customer reply received
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <input
                            type="checkbox"
                            id="slaBreached"
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            defaultChecked
                          />
                          <Label htmlFor="slaBreached" className="text-sm">
                            SLA breached warning
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <input
                            type="checkbox"
                            id="dailySummary"
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <Label htmlFor="dailySummary" className="text-sm">
                            Daily summary report
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sound Alerts */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                        <Volume2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      Sound Alerts
                    </CardTitle>
                    <CardDescription>
                      Configure sound notifications for important events.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="space-y-0.5">
                        <Label htmlFor="soundAlerts" className="text-sm font-medium">
                          Sound Alerts
                        </Label>
                        <p className="text-xs text-gray-500">
                          Play a sound when new tickets or messages arrive.
                        </p>
                      </div>
                      <Switch
                        id="soundAlerts"
                        checked={settings.soundAlerts === 'true'}
                        onCheckedChange={(checked) => {
                          updateSetting('soundAlerts', String(checked))
                          saveSetting('soundAlerts', String(checked))
                        }}
                        className="data-[state=checked]:bg-teal-600"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sound preferences
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Notification Sound</Label>
                          <Select defaultValue="chime">
                            <SelectTrigger>
                              <SelectValue placeholder="Select sound" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="chime">Chime</SelectItem>
                              <SelectItem value="bell">Bell</SelectItem>
                              <SelectItem value="ping">Ping</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Volume</Label>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              defaultValue="70"
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <span className="text-sm text-gray-500 w-10">70%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Settings */}
            <TabsContent value="ai">
              <div className="grid gap-6">
                {/* Bring Your Own Key (BYOK) */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      Bring Your Own Key (BYOK)
                    </CardTitle>
                    <CardDescription>
                      Use your own Gemini API key for AI features. This gives you full control over usage and costs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Key Status */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        {aiSettings.hasApiKey ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <div>
                              <p className="text-sm font-medium">Custom API Key Active</p>
                              <p className="text-xs text-gray-500">
                                Key: {aiSettings.apiKeyPreview}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Key className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">Using Default Key</p>
                              <p className="text-xs text-gray-500">
                                A demo API key is being used. Add your own for full access.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      {aiSettings.hasApiKey && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={deleteApiKey}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* API Key Input */}
                    <div className="space-y-3">
                      <Label htmlFor="apiKey" className="text-sm font-medium">
                        Gemini API Key
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1 max-w-md">
                          <Input
                            id="apiKey"
                            type={showApiKey ? 'text' : 'password'}
                            placeholder="AIzaSy..."
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showApiKey ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <Button
                          onClick={saveApiKey}
                          disabled={!apiKeyInput.trim() || isValidatingKey}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          {isValidatingKey ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Validating...
                            </>
                          ) : (
                            <>
                              <Key className="h-4 w-4 mr-2" />
                              Save Key
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Get your API key from{' '}
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline"
                        >
                          Google AI Studio
                        </a>
                        . Your key is stored securely and never shared.
                      </p>
                    </div>

                    {/* Model Info */}
                    <div className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800">
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        <span className="font-medium text-sm">Current Model</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Gemini 2.0 Flash-Lite</strong> - Fast, efficient, and cost-effective for customer support tasks.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Features */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                        <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      AI Assistant Settings
                    </CardTitle>
                    <CardDescription>
                      Configure AI-powered features to enhance your workflow.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Auto Suggestions */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-800">
                          <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="aiAutoSuggestions" className="text-sm font-medium">
                            AI Auto-Suggestions
                          </Label>
                          <p className="text-xs text-gray-500 max-w-md">
                            Automatically generate response suggestions when viewing tickets.
                            AI analyzes the conversation context to provide relevant replies.
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="aiAutoSuggestions"
                        checked={settings.aiAutoSuggestions === 'true'}
                        onCheckedChange={(checked) => {
                          updateSetting('aiAutoSuggestions', String(checked))
                          saveSetting('aiAutoSuggestions', String(checked))
                        }}
                        className="data-[state=checked]:bg-violet-600"
                      />
                    </div>

                    {/* Sentiment Analysis */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200 dark:border-teal-800">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-800">
                          <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="sentimentAnalysis" className="text-sm font-medium">
                            Sentiment Analysis
                          </Label>
                          <p className="text-xs text-gray-500 max-w-md">
                            Automatically analyze customer messages for sentiment.
                            Helps identify frustrated customers and prioritize responses.
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="sentimentAnalysis"
                        checked={settings.sentimentAnalysis === 'true'}
                        onCheckedChange={(checked) => {
                          updateSetting('sentimentAnalysis', String(checked))
                          saveSetting('sentimentAnalysis', String(checked))
                        }}
                        className="data-[state=checked]:bg-teal-600"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* AI Model Settings */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Model Configuration</CardTitle>
                    <CardDescription>
                      Advanced settings for AI behavior and performance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Response Style</Label>
                        <Select defaultValue="professional">
                          <SelectTrigger>
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="concise">Concise</SelectItem>
                            <SelectItem value="detailed">Detailed</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Adjust the tone of AI-generated responses.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Suggestion Frequency</Label>
                        <Select defaultValue="realtime">
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="onRequest">On Request</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          How often AI suggestions are generated.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                      <Palette className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    Appearance Settings
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of your dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-teal-500 bg-white dark:bg-gray-800">
                        <div className="w-full h-16 rounded bg-gray-100 dark:bg-gray-700" />
                        <span className="text-sm font-medium">System</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                        <div className="w-full h-16 rounded bg-white border border-gray-200" />
                        <span className="text-sm font-medium">Light</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                        <div className="w-full h-16 rounded bg-gray-900 border border-gray-700" />
                        <span className="text-sm font-medium">Dark</span>
                      </button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Accent Color
                    </h4>
                    <div className="flex gap-3">
                      <button className="w-8 h-8 rounded-full bg-teal-500 ring-2 ring-offset-2 ring-teal-500" />
                      <button className="w-8 h-8 rounded-full bg-violet-500 hover:ring-2 hover:ring-offset-2 hover:ring-violet-500" />
                      <button className="w-8 h-8 rounded-full bg-rose-500 hover:ring-2 hover:ring-offset-2 hover:ring-rose-500" />
                      <button className="w-8 h-8 rounded-full bg-amber-500 hover:ring-2 hover:ring-offset-2 hover:ring-amber-500" />
                      <button className="w-8 h-8 rounded-full bg-emerald-500 hover:ring-2 hover:ring-offset-2 hover:ring-emerald-500" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Choose your preferred accent color for buttons and highlights.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
