export const STORAGE_KEYS: Record<string, string> = {
  EDITOR_CONTENT: "editor_content",
  EDITOR_AUTO_SAVE: "editor_auto_save",
  PREVIEW_SCALE_MODE: "preview_scale_mode",
  LOCAL_LIQUID: "local_liquid",
  SHARED_LIQUID: "shared_liquid",
  LIQUID_EXPANDED: "liquid_expanded"
} as const;

export const UI_STATE: Record<string, string> = {
  MJML_EDITOR: "mjml_editor",
  RESIZABLE_PANEL: "resizable_panel",
  THEME: "theme",
  LIQUID: "liquid",
  EXPORT: "export",
  HTML_EXPORT_OPTIONS: "html_export_options",
  LAYOUT: "layout",
  VIEWPORT: "viewport",
  HELP: "help",
  LOCAL_LIQUID_SHEET: "local_liquid_sheet",
  SHARED_LIQUID_SHEET: "shared_liquid_sheet"
} as const;

export const STANDARD_HOTKEYS: {
  title: string;
  hotkeys: { id: string; key: string; description: string }[];
}[] = [
  {
    title: "Global Navigation",
    hotkeys: [
      { id: "FOCUS_EDITOR", key: "alt+`", description: "Focus MJML editor" },
      { id: "SNAP_PREVIEW_LEFT", key: "alt+left", description: "Snap previewer to the left" },
      { id: "SNAP_PREVIEW_RIGHT", key: "alt+right", description: "Snap previewer to the right" },
      { id: "TOGGLE_HELP", key: "alt+.", description: "Toggle help dialog" }
    ]
  },
  {
    title: "Viewport Manager",
    hotkeys: [
      { id: "TOGGLE_VIEWPORT", key: "alt+1", description: "Toggle viewport menu" },
      { id: "VIEWPORT_DESKTOP", key: "alt+d", description: "Switch to desktop preset" },
      { id: "VIEWPORT_MOBILE", key: "alt+m", description: "Switch to mobile preset" },
      { id: "VIEWPORT_WIDTH", key: "alt+w", description: "Focus width input" },
      { id: "VIEWPORT_HEIGHT", key: "alt+h", description: "Focus height input" }
    ]
  },
  {
    title: "Liquid Manager",
    hotkeys: [
      { id: "TOGGLE_LIQUID", key: "alt+2", description: "Toggle liquid menu" },
      { id: "LIQUID_LOCAL", key: "alt+l", description: "Open local liquid" },
      { id: "LIQUID_SHARED", key: "alt+s", description: "Open shared liquid" }
    ]
  },
  {
    title: "Liquid Injector",
    hotkeys: [
      { id: "LIQUID_SAVE", key: "alt+enter", description: "Save changes" },
      { id: "LIQUID_RESET", key: "alt+backspace", description: "Reset changes" },
      { id: "LIQUID_GENERATE", key: "alt+g", description: "Generate Ascenda template" },
      { id: "LIQUID_EXPAND", key: "alt+e", description: "Toggle expand" }
    ]
  },
  {
    title: "Export Manager",
    hotkeys: [
      { id: "TOGGLE_COPY", key: "alt+3", description: "Toggle export menu" },
      { id: "COPY_HTML", key: "alt+h", description: "Copy HTML" },
      { id: "COPY_MJML", key: "alt+m", description: "Copy MJML" },
      { id: "COPY_LOCAL", key: "alt+l", description: "Copy local liquid" },
      { id: "COPY_SHARED", key: "alt+s", description: "Copy shared liquid" },
      { id: "EXPORT_IMAGE", key: "alt+i", description: "Export image" }
    ]
  },
  {
    title: "Layout Manager",
    hotkeys: [
      { id: "TOGGLE_LAYOUT", key: "alt+4", description: "Toggle fullscreen" }
    ]
  },
  {
    title: "Theme Manager",
    hotkeys: [
      { id: "TOGGLE_THEME", key: "alt+5", description: "Toggle theme menu" },
      { id: "THEME_LIGHT", key: "alt+l", description: "Switch to light theme" },
      { id: "THEME_DARK", key: "alt+d", description: "Switch to dark theme" },
      { id: "THEME_SYSTEM", key: "alt+s", description: "Switch to system theme" }
    ]
  },
  {
    title: "MJML Preview",
    hotkeys: [
      { id: "TOGGLE_PREVIEW_SCALE", key: "alt+f", description: "Toggle preview scale mode" },
      { id: "REFRESH_PREVIEW", key: "alt+r", description: "Refresh preview" }
    ]
  }
] as const;

export const HOTKEYS: Record<string, { key: string, description: string, hint: string }> = {
  ...Object.fromEntries(
    STANDARD_HOTKEYS.flatMap(section =>
      section.hotkeys.map(hotkey => [
        hotkey.id,
        {
          key: hotkey.key, 
          description: hotkey.description,
          hint: hotkey.key.split("+")[1] || hotkey.key
        }
      ])
    )
  )
} as const;

export const DEFAULT_SHARED_LIQUID: Record<string, unknown> = {
  "app_name": "MJML Liquid Preview",
  "brand": {
    "primary_color": "#F97316",
  },
  "cta": {
    "text": "Try Me!",
    "url": "https://github.com/lohkokwee/mjml-liquid-preview"
  }
};

export const DEFAULT_LOCAL_LIQUID: Record<string, unknown> = {
  "user": {
    "id": "32418121239",
    "name": "random person on the internet"
  },
  "features": [
    { "title": "Trying out different viewports", "shortcut": "alt + 1" },
    { 
      "title": "Accessing and updating local & shared liquid", 
      "shortcut": "alt + 2", 
      "description": "Local liquids carry the concept of more dynamic attributes, while shared liquids carry the concept of more static attributes. At it's core, both evaluate to the same JSON data." 
    },
    { "title": "Quick copying MJML, HTML, local & shared liquid", "shortcut": "alt + 3" },
    { "title": "Toggling fullscreen mode", "shortcut": "alt + 4" },
    { "title": "Switching themes", "shortcut": "alt + 5" }
  ]
};

export const DEFAULT_MJML: string = `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="helvetica" />
      <mj-text font-size="16px" color="#333" />
      <mj-button background-color="{{ brand.primary_color }}" />
    </mj-attributes>
  </mj-head>

  <mj-body>
    <mj-section background-color="{{ brand.primary_color }}">
      <mj-column>
        <mj-text color="#fff" font-size="28px" align="center">
          Welcome to {{ app_name }}
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section>
      <mj-column>
        <mj-text font-size="20px">
          Hey {{ user.name }}! 👋
        </mj-text>
        <mj-text>
          Ready to explore as our {{ user.id }}th user? Give these features a shot!
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section>
      <mj-column>
        {% for feature in features %}
          <mj-text>
            <strong>{{ feature.title }}</strong>
          </mj-text>
          <mj-text>
            • Hotkey: <code>{{ feature.shortcut }}</code>
          </mj-text>
          {% if feature.description %}
            <mj-text>
              {{ feature.description }}
            </mj-text>
          {% endif %}
        {% endfor %}
      </mj-column>
    </mj-section>

    <mj-section>
      <mj-column>
        <mj-button href="{{ cta.url }}">
          {{ cta.text }}
        </mj-button>
        <mj-text align="center" font-size="14px" color="#666">
          Hit <code>alt + .</code> anytime to see all shortcuts!
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

export const ASCENDA_LIQUID_TEMPLATE: Record<string, unknown> = {
  "hide_ascenda_brand": false,
  "theme_brand_primary_color": "#22285A",
  "theme_brand_secondary_color": "#FFC0CB",
  "theme_brand_header_color": "#22285A",
  "theme_brand_header_background_color": "#FFFFFF",
  "theme_brand_header_font_family": "Lexend",
  "theme_brand_header_font_family_url": "https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap",
  "theme_brand_body_font_color": "#22285A",
  "theme_brand_body_font_family": "Lexend",
  "theme_brand_body_font_family_url": "https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap",
  "theme_brand_navigation_background_color": "#FFFFFF",
  "theme_brand_navigation_logo": "",
  "theme_brand_navigation_text_color": "#22285A",
  "theme_brand_footer_background_color": "#FFFFFF",
  "theme_brand_footer_color": "#22285A",
  "theme_brand_footer_logo": "",
  "theme_brand_brand_logo": "",
  "theme_brand_inverted_logo": "",
  "theme_brand_primary_button_border_width": "1px",
  "theme_brand_primary_button_border_radius": "4px",
  "theme_brand_secondary_button_border_width": "1px",
  "theme_brand_secondary_button_border_radius": "4px",
  "theme_brand_primary_200_color": "#c8c9d6",
  "theme_brand_secondary_200_color": "#ffeff2",
  "ascenda_contact_email": "rewardscentral@support.ascenda.com",
  "ascenda_contact_phone": "[+00 (00) 1234 5678]"
}
