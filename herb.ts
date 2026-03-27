/**
 * Herb v1.0.1
 * Created for my CS IA (hence the comments)
 * 
 * @author Noel Nimstad <noel@nimstad.com>
 */

/**
 * Creates an HTML tag for use in an herb
 * @param type The tag type (e.g. h1, p, span)
 * @param content The content (innerHTML) of the tag
 * @param attributes Attributes formatted in an array as [ATTRIBUTE_NAME, VALUE], e.g. [["class", "my_class"]]
 * @returns Returns the created tag as a string
 */
function tag(type: string, content: string, attributes: Array<Array<string>>): string
{
    // create a new element with type and set content
    const e = document.createElement(type);
    e.innerHTML = content; 

    // set attributes
    for(let i = 0; i < attributes?.length; i++)
    {
        e.setAttribute(attributes[i]![0] ?? "", attributes[i]![1] ?? "");
    }

    return e.outerHTML;
}

// object structure
interface HerbElement
{
    element: Element,
    id: string,
    map: string | undefined,
    content: string | undefined
}

/**
 * Create HerbElement from a normal HTMLElement (for internal use only!)
 */
function createTag(element: Element): HerbElement | null
{   
    // extract contenet
    const innerHTML: string = element.innerHTML.trim();
    const template: string | undefined = element.getAttribute("template")?.trim();
    const map: string | undefined = element.getAttribute("map")?.trim(); // for mapping arrays

    /*
        templates are given through:
        1. <tag herb>TEMPLATE</tag>
        2. <tag herb template="TEMPLATE"></tag>
    */
    if(!innerHTML && !template && !map)
    {
        console.error(`No template given for herb tag:`, element);
        return null;
    }

    // clear inner content as it will be replaced
    element.innerHTML = "";

    // return the HerbElement
    return {
        element: element,
        id: element.id,
        map: map,
        content: "" === innerHTML ? template : innerHTML
    };
}

function processFauxMLOptions(options: string): string[][]
{
    if(options.trim().length === 0) return [];

    let result: string[][] = [];
    const matches: string[][] = [...options.matchAll(/(\w+)(=("[\s\S]+?"|\d+))?/g)];

    for(let i: number = 0; i < matches.length; i++)
    {
        result.push([matches[i]![1]!, matches[i]![3]!.substring(1, matches[i]![3]!.length - 1)]);
    }

    return result;
}

function processFauxML(content: string): string
{
    // If there is no more FauxML left
    if(!/<[a-zA-Z]+[^>]*>.*?<\/[a-zA-Z]+>/.test(content))
    {
        return content;
    }

    return content.replace(/<([a-zA-Z]+)([^>]*)>([\s\S]*?)<\/\1>/g, (_, tagName: string, attributes: string, innerContent: string) =>
    {
        const processedInnerContent: string = processFauxML(innerContent);
        const processedAttributes: string[][] = processFauxMLOptions(attributes);

        console.log(`tag("${ tagName }", ${ processedInnerContent }, ${ JSON.stringify(processedAttributes) })`);
        return `tag("${ tagName }", ${ processedInnerContent }, ${ JSON.stringify(processedAttributes) })`;
    });
}

// global array of current HerbTags
let _tags: Array<HerbElement> = [];
/**
 * Helper function to parse the intention of the herb template (for internal use only!)
 */
function generateCommand(element: HerbElement): string
{
    let result: string = element.content!;

    if(herb.beta.JSX)
    {
        result = processFauxML(result);
    }

    if(element.map != null)
    {
        return `${ element.map }.map($h => { return ${ result } }).join('')`;
    } else
    {
        return result;
    }
}
// main Herb object
const herb:
{
    readonly refresh: Function,
    readonly propagate: Function,
    readonly initialise: Function,
    readonly initialiseAndPropagate: Function,
    readonly start: Function,
    readonly beta:
    {
        JSX: boolean
    }
} =
{
    /**
     * Refresh the content of a specific Herb tag (by id)
     * @param id The id of the element to refresh
     */
    refresh: (id: string): void =>
    {
        // if no tags exist or the id is null, terminate
        if(null === _tags || null === id) return;
        // find element by id
        const found: HerbElement | undefined = _tags.find(e => id == e?.id);
        
        // if it does not exist, terminate
        if(undefined === found) return;
        // otherwise, re-evaluate content
        found.element.innerHTML = eval(generateCommand(found));
    },
    /**
     * Display initial UI values
     */
    propagate: (): void =>
    {
        if(null === _tags) return;

        // execute each elements command if it exists
        for(let i: number = 0; i < _tags.length; i++)
        {   
            _tags[i]!.element.innerHTML = eval(generateCommand(_tags[i]!));
        }
    },
    /**
     * Get all HTML tags which need Herb-ing and store them in _tags
     * Note that this function must be run before propagation or refreshing!
     */
    initialise: (...features: string[]): void =>
    {   
        const tags: Array<Element> = [...Array.from(document.querySelectorAll("[herb]"))];
        for(let i: number = 0; i < tags.length; i++)
        {
            const tag: HerbElement | null = createTag(tags[i]!);
            if(tag) _tags.push(tag);
        }
        
        for(let i: number = 0; i < features.length; i++)
        {
            switch(features[i])
            {
                case "FauxML":
                    herb.beta.JSX = true;
                    break;
                default:
                    console.error(`Beta feature ${ features[i] } does not exist!`);
                    break;
            }
        }
    },
    /**
     * Run initialise and propagate, also known as `start`
     */
    initialiseAndPropagate: (...features: string[]): void => 
    {
        herb.initialise(...features);
        herb.propagate();
    },
    /**
     * Run initialise and propagate, also known as `initialiseAndPropagate`
     */
    start: (...features: string[]): void =>
    {
        herb.initialiseAndPropagate(...features);
    },
    /**
     * Beta feature configuration
     */
    beta:
    {
        JSX: false
    }
}

export { tag, herb };