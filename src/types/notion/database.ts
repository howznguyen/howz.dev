// Database and Page Types
export interface NotionDatabase {
  object: 'database';
  id: string;
  created_time: string;
  created_by: {
    object: string;
    id: string;
  };
  last_edited_by: {
    object: string;
    id: string;
  };
  last_edited_time: string;
  title: Array<{
    type: 'text';
    text: {
      content: string;
      link?: string | null;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href?: string | null;
  }>;
  description: Array<any>;
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
  properties: Record<string, DatabaseProperty>;
  parent: {
    type: 'page_id' | 'workspace';
    page_id?: string;
  };
  url: string;
  archived: boolean;
  is_inline: boolean;
  public_url?: string | null;
}

export interface DatabaseProperty {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
}

// Page Types
export interface NotionPage {
  object: 'page';
  id: string;
  created_time: string;
  created_by: {
    object: string;
    id: string;
  };
  last_edited_by: {
    object: string;
    id: string;
  };
  last_edited_time: string;
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
  properties: Record<string, PageProperty>;
  parent: {
    type: 'database_id' | 'page_id' | 'workspace';
    database_id?: string;
    page_id?: string;
  };
  url: string;
  public_url?: string | null;
}

// Property Types
export interface PageProperty {
  id: string;
  type: string;
  [key: string]: any;
}

export interface TitleProperty extends PageProperty {
  type: 'title';
  title: Array<{
    type: 'text';
    text: {
      content: string;
      link?: string | null;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href?: string | null;
  }>;
}

export interface RichTextProperty extends PageProperty {
  type: 'rich_text';
  rich_text: Array<{
    type: 'text';
    text: {
      content: string;
      link?: string | null;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href?: string | null;
  }>;
}

export interface NumberProperty extends PageProperty {
  type: 'number';
  number: number | null;
}

export interface SelectProperty extends PageProperty {
  type: 'select';
  select: {
    id: string;
    name: string;
    color: string;
  } | null;
}

export interface MultiSelectProperty extends PageProperty {
  type: 'multi_select';
  multi_select: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

export interface DateProperty extends PageProperty {
  type: 'date';
  date: {
    start: string;
    end?: string | null;
    time_zone?: string | null;
  } | null;
}

export interface CheckboxProperty extends PageProperty {
  type: 'checkbox';
  checkbox: boolean;
}

export interface URLProperty extends PageProperty {
  type: 'url';
  url: string | null;
}

export interface EmailProperty extends PageProperty {
  type: 'email';
  email: string | null;
}

export interface PhoneProperty extends PageProperty {
  type: 'phone_number';
  phone_number: string | null;
}

export interface FormulaProperty extends PageProperty {
  type: 'formula';
  formula: {
    type: 'string' | 'number' | 'boolean' | 'date';
    string?: string | null;
    number?: number | null;
    boolean?: boolean | null;
    date?: {
      start: string;
      end?: string | null;
      time_zone?: string | null;
    } | null;
  };
}

export interface RelationProperty extends PageProperty {
  type: 'relation';
  relation: Array<{
    id: string;
  }>;
  has_more: boolean;
}

export interface RollupProperty extends PageProperty {
  type: 'rollup';
  rollup: {
    type: 'number' | 'date' | 'array' | 'unsupported' | 'incomplete';
    number?: number | null;
    date?: {
      start: string;
      end?: string | null;
      time_zone?: string | null;
    } | null;
    array?: Array<any>;
    function: string;
  };
}

export interface PeopleProperty extends PageProperty {
  type: 'people';
  people: Array<{
    object: 'user';
    id: string;
    name?: string;
    avatar_url?: string | null;
    type?: 'person' | 'bot';
    person?: {
      email?: string;
    };
    bot?: Record<string, any>;
  }>;
}

export interface FilesProperty extends PageProperty {
  type: 'files';
  files: Array<{
    name: string;
    type: 'external' | 'file';
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
  }>;
}

export interface CreatedTimeProperty extends PageProperty {
  type: 'created_time';
  created_time: string;
}

export interface CreatedByProperty extends PageProperty {
  type: 'created_by';
  created_by: {
    object: 'user';
    id: string;
    name?: string;
    avatar_url?: string | null;
    type?: 'person' | 'bot';
    person?: {
      email?: string;
    };
    bot?: Record<string, any>;
  };
}

export interface LastEditedTimeProperty extends PageProperty {
  type: 'last_edited_time';
  last_edited_time: string;
}

export interface LastEditedByProperty extends PageProperty {
  type: 'last_edited_by';
  last_edited_by: {
    object: 'user';
    id: string;
    name?: string;
    avatar_url?: string | null;
    type?: 'person' | 'bot';
    person?: {
      email?: string;
    };
    bot?: Record<string, any>;
  };
}

// Union type for all property types
export type AnyPageProperty = 
  | TitleProperty
  | RichTextProperty
  | NumberProperty
  | SelectProperty
  | MultiSelectProperty
  | DateProperty
  | CheckboxProperty
  | URLProperty
  | EmailProperty
  | PhoneProperty
  | FormulaProperty
  | RelationProperty
  | RollupProperty
  | PeopleProperty
  | FilesProperty
  | CreatedTimeProperty
  | CreatedByProperty
  | LastEditedTimeProperty
  | LastEditedByProperty
  | PageProperty;

export default NotionPage;