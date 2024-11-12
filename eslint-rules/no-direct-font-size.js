module.exports = {
    meta: {
        type: 'problem',
        docs: {
            recommended: true,
            description: 'Enforces usage of RFValue or RFPercentage for fontSize',
        },
        messages: {
            avoidDirectFontSize:
                'Avoid using direct fontSize values. Use RFValue or RFPercentage instead.',
        },
        schema: [],
    },
    create: (context) => {
        return {
            Property(node) {
                // Check if the property is "fontSize"
                if (node.key && node.key.name === 'fontSize') {
                    // Check if the value is a numeric literal (e.g., fontSize: 16)
                    if (
                        node.value &&
                        node.value.type === 'Literal' &&
                        typeof node.value.value === 'number'
                    ) {
                        context.report({
                            node,
                            messageId: 'avoidDirectFontSize',
                        })
                    }
                }
            },
        }
    },
}
