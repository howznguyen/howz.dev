// API Response Types
export interface NotionAPIResponse<T = any> {
  object: string;
  results: T[];
  next_cursor?: string | null;
  has_more: boolean;
  type?: string;
  page?: {};
  developer_survey?: string;
  request_id: string;
}

export interface NotionError {
  object: 'error';
  status: number;
  code: string;
  message: string;
  developer_survey?: string;
  request_id: string;
}

// Query Types
export interface NotionQuery {
  sorts?: Array<{
    property?: string;
    direction: 'ascending' | 'descending';
    timestamp?: 'created_time' | 'last_edited_time';
  }>;
  filter?: NotionFilter;
  start_cursor?: string;
  page_size?: number;
}

export interface NotionFilter {
  or?: NotionFilter[];
  and?: NotionFilter[];
  property?: string;
  title?: TextFilter;
  rich_text?: TextFilter;
  number?: NumberFilter;
  checkbox?: CheckboxFilter;
  select?: SelectFilter;
  multi_select?: MultiSelectFilter;
  date?: DateFilter;
  people?: PeopleFilter;
  files?: FilesFilter;
  relation?: RelationFilter;
  formula?: FormulaFilter;
  rollup?: RollupFilter;
  created_time?: DateFilter;
  created_by?: PeopleFilter;
  last_edited_time?: DateFilter;
  last_edited_by?: PeopleFilter;
}

// Filter Types
export interface TextFilter {
  equals?: string;
  does_not_equal?: string;
  contains?: string;
  does_not_contain?: string;
  starts_with?: string;
  ends_with?: string;
  is_empty?: true;
  is_not_empty?: true;
}

export interface NumberFilter {
  equals?: number;
  does_not_equal?: number;
  greater_than?: number;
  less_than?: number;
  greater_than_or_equal_to?: number;
  less_than_or_equal_to?: number;
  is_empty?: true;
  is_not_empty?: true;
}

export interface CheckboxFilter {
  equals?: boolean;
  does_not_equal?: boolean;
}

export interface SelectFilter {
  equals?: string;
  does_not_equal?: string;
  is_empty?: true;
  is_not_empty?: true;
}

export interface MultiSelectFilter {
  contains?: string;
  does_not_contain?: string;
  is_empty?: true;
  is_not_empty?: true;
}

export interface DateFilter {
  equals?: string;
  before?: string;
  after?: string;
  on_or_before?: string;
  on_or_after?: string;
  past_week?: {};
  past_month?: {};
  past_year?: {};
  next_week?: {};
  next_month?: {};
  next_year?: {};
  is_empty?: true;
  is_not_empty?: true;
}

export interface PeopleFilter {
  contains?: string;
  does_not_contain?: string;
  is_empty?: true;
  is_not_empty?: true;
}

export interface FilesFilter {
  is_empty?: true;
  is_not_empty?: true;
}

export interface RelationFilter {
  contains?: string;
  does_not_contain?: string;
  is_empty?: true;
  is_not_empty?: true;
}

export interface FormulaFilter {
  string?: TextFilter;
  checkbox?: CheckboxFilter;
  number?: NumberFilter;
  date?: DateFilter;
}

export interface RollupFilter {
  any?: NotionFilter;
  every?: NotionFilter;
  none?: NotionFilter;
  string?: TextFilter;
  number?: NumberFilter;
  checkbox?: CheckboxFilter;
  date?: DateFilter;
}

// User Types
export interface NotionUser {
  object: 'user';
  id: string;
  type?: 'person' | 'bot';
  name?: string;
  avatar_url?: string | null;
  person?: {
    email?: string;
  };
  bot?: {
    owner: {
      type: 'workspace' | 'user';
      workspace?: boolean;
      user?: NotionUser;
    };
    workspace_name?: string;
  };
}

// Search Types
export interface NotionSearchQuery {
  query?: string;
  sort?: {
    direction: 'ascending' | 'descending';
    timestamp: 'last_edited_time';
  };
  filter?: {
    value: 'page' | 'database';
    property: 'object';
  };
  start_cursor?: string;
  page_size?: number;
}

export interface NotionSearchResult {
  object: 'page' | 'database';
  id: string;
  created_time: string;
  created_by: NotionUser;
  last_edited_time: string;
  last_edited_by: NotionUser;
  archived: boolean;
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
  } | null;
  cover?: {
    type: 'external' | 'file';
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
  } | null;
  properties?: Record<string, any>;
  parent?: {
    type: 'database_id' | 'page_id' | 'workspace';
    database_id?: string;
    page_id?: string;
  };
  url: string;
  public_url?: string | null;
}

// Rate Limiting Types
export interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
  retry_after?: number;
}

// Request Options
export interface NotionRequestOptions {
  auth?: string;
  version?: string;
  timeout?: number;
  retries?: number;
  rateLimit?: boolean;
  cache?: boolean;
  cacheTTL?: number;
}

// Webhook Types
export interface NotionWebhook {
  id: string;
  url: string;
  created_time: string;
  created_by: NotionUser;
  last_edited_time: string;
  last_edited_by: NotionUser;
  archived: boolean;
  event_types: Array<'page.property_values' | 'page.created' | 'page.deleted'>;
  request_url: string;
  properties?: Record<string, any>;
}

export interface WebhookEvent {
  object: 'event';
  id: string;
  type: 'page.property_values' | 'page.created' | 'page.deleted';
  created_time: string;
  data: {
    page_id: string;
    property_id?: string;
    property_values?: Record<string, any>;
  };
}

export default NotionAPIResponse;